import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { User } from '../../../../../lib/models';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../../../lib/cloudinary';

// GET - Get user profile
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

    // Format user data
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.customImage?.url || user.image,
      bio: user.bio,
      joinedAt: user.joinedAt,
      stats: user.stats,
    };

    return NextResponse.json({ user: userData }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio } = body;

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user data
    if (name?.trim()) {
      user.name = name.trim();
    }
    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    await user.save();

    // Return updated user data
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.customImage?.url || user.image,
      bio: user.bio,
      joinedAt: user.joinedAt,
      stats: user.stats,
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Upload profile picture
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete old custom image if exists
    if (user.customImage?.publicId) {
      try {
        await deleteFromCloudinary(user.customImage.publicId);
      } catch (deleteError) {
        console.error('Error deleting old image:', deleteError);
      }
    }

    // Upload new image
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'bharatai/profile-pictures');

    // Update user with new image
    user.customImage = {
      publicId: uploadResult.publicId,
      url: uploadResult.url,
    };

    await user.save();

    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.url,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete profile picture
export async function DELETE(request) {
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

    // Delete custom image if exists
    if (user.customImage?.publicId) {
      try {
        await deleteFromCloudinary(user.customImage.publicId);
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError);
      }
    }

    // Remove custom image from user
    user.customImage = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile picture deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}