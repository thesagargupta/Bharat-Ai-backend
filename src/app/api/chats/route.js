import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '../../../../lib/mongodb';
import { User, Chat } from '../../../../lib/models';
import { generateChatResponse, generateChatTitle } from '../../../../lib/n8n-webhook';
import { uploadToCloudinary } from '../../../../lib/cloudinary';

// GET - Fetch user's chats
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user's chats
    const chats = await Chat.find({ 
      userId: user._id, 
      isArchived: false 
    })
    .select('title createdAt updatedAt messages')
    .sort({ updatedAt: -1 })
    .limit(50);

    // Format chats for frontend
    const formattedChats = chats.map(chat => ({
      id: chat._id.toString(),
      title: chat.title,
      messageCount: chat.messages.length,
      lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content.slice(0, 100) : '',
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    return NextResponse.json({ chats: formattedChats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new chat or send message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, chatId, imageData, generatedImageUrl } = body;

    if (!message?.trim() && !imageData) {
      return NextResponse.json({ error: 'Message or image is required' }, { status: 400 });
    }

    // Use message as-is, or empty string for image-only messages
    const messageContent = message?.trim() || '';

    await connectToDatabase();

    // Find or create user
    let user = await User.findOne({ email: session.user.email });
    if (!user) {
      user = await User.create({
        email: session.user.email,
        name: session.user.name || 'User',
        image: session.user.image,
        provider: 'google', // Default, can be updated based on the provider
        providerId: session.user.id || session.user.email,
      });
    }

    // Update user's last active time
    user.lastActiveAt = new Date();
    await user.save();

    let chat;
    let isNewChat = false;

    if (chatId) {
      // Find existing chat
      chat = await Chat.findOne({ _id: chatId, userId: user._id });
      if (!chat) {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      }
    } else {
      // Create new chat
      isNewChat = true;
      // Generate title from message, or use default for image-only
      const titleSource = messageContent || 'Image Analysis';
      const title = await generateChatTitle(titleSource);
      
      chat = await Chat.create({
        userId: user._id,
        title: title,
        messages: [],
      });

      // Update user stats
      user.stats.totalChats += 1;
      await user.save();
    }

    // Handle image upload if present
    let uploadedImage = null;
    if (imageData) {
      try {
        const buffer = Buffer.from(imageData.data, 'base64');
        uploadedImage = await uploadToCloudinary(buffer, 'bharatai/chat-images');
        user.stats.imagesAnalyzed += 1;
        await user.save();
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    // Create user message
    const userMessage = {
      role: 'user',
      content: messageContent,
      image: uploadedImage ? {
        publicId: uploadedImage.publicId,
        url: uploadedImage.url,
      } : undefined,
      timestamp: new Date(),
    };

    // Add user message to chat
    chat.messages.push(userMessage);

    // Prepare conversation history for AI
    const conversationHistory = chat.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate AI response
    const aiResponse = await generateChatResponse(
      messageContent,
      conversationHistory.slice(0, -1), // Exclude the current message
      imageData ? { 
        buffer: Buffer.from(imageData.data, 'base64'), 
        mimetype: imageData.type,
        fileName: imageData.fileName || 'uploaded-image.jpg'
      } : null
    );

    // Create assistant message
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse.message,
      image: generatedImageUrl ? { url: generatedImageUrl } : undefined,
      timestamp: new Date(),
    };

    // Add assistant message to chat
    chat.messages.push(assistantMessage);
    chat.updatedAt = new Date();

    // Save chat
    await chat.save();

    // Update user stats
    user.stats.totalMessages += 2; // User message + AI response
    await user.save();

    // Return response with the message IDs from the saved chat
    const savedUserMessage = chat.messages[chat.messages.length - 2]; // Second to last message (user)
    const savedAssistantMessage = chat.messages[chat.messages.length - 1]; // Last message (assistant)
    
    // Helper function to clean image data
    const cleanImageData = (image) => {
      if (!image) return undefined;
      if (typeof image === 'string' && image.trim() !== '') return image;
      if (typeof image === 'object' && image.url && typeof image.url === 'string' && image.url.trim() !== '') {
        return { publicId: image.publicId, url: image.url };
      }
      return undefined;
    };
    
    const response = {
      chatId: chat._id.toString(),
      isNewChat,
      userMessage: {
        id: savedUserMessage._id.toString(),
        role: savedUserMessage.role,
        content: savedUserMessage.content,
        image: cleanImageData(savedUserMessage.image),
        timestamp: savedUserMessage.timestamp,
      },
      assistantMessage: {
        id: savedAssistantMessage._id.toString(),
        role: savedAssistantMessage.role,
        content: savedAssistantMessage.content,
        image: cleanImageData(savedAssistantMessage.image),
        timestamp: savedAssistantMessage.timestamp,
      },
      chatTitle: chat.title,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a chat
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find and delete chat
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId: user._id });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Update user stats
    user.stats.totalChats = Math.max(0, user.stats.totalChats - 1);
    user.stats.totalMessages = Math.max(0, user.stats.totalMessages - chat.messages.length);
    await user.save();

    return NextResponse.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}