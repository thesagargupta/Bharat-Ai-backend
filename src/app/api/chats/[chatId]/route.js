import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { User, Chat } from '../../../../../lib/models';

// GET - Fetch specific chat with messages
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await params;

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find chat with messages
    const chat = await Chat.findOne({ _id: chatId, userId: user._id });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Helper function to clean image data
    const cleanImageData = (image) => {
      if (!image) return undefined;
      if (typeof image === 'string' && image.trim() !== '') return image;
      if (typeof image === 'object' && image.url && typeof image.url === 'string' && image.url.trim() !== '') {
        return { publicId: image.publicId, url: image.url };
      }
      return undefined;
    };

    // Format chat for frontend
    const formattedChat = {
      id: chat._id.toString(),
      title: chat.title,
      messages: chat.messages.map(msg => ({
        id: msg._id.toString(),
        role: msg.role,
        content: msg.content,
        image: cleanImageData(msg.image),
        timestamp: msg.timestamp,
      })),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };

    return NextResponse.json({ chat: formattedChat });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update chat title
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await params;
    const body = await request.json();
    const { title } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update chat title
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: user._id },
      { title: title.trim(), updatedAt: new Date() },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      chat: {
        id: chat._id.toString(),
        title: chat.title,
        updatedAt: chat.updatedAt,
      }
    });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}