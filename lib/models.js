import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: "AI enthusiast and developer passionate about creating intelligent solutions.",
    maxLength: 500,
  },
  provider: {
    type: String,
    enum: ['google', 'github'],
    required: true,
  },
  providerId: {
    type: String,
    required: true,
  },
  customImage: {
    publicId: String,
    url: String,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
  stats: {
    totalChats: {
      type: Number,
      default: 0,
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    imagesAnalyzed: {
      type: Number,
      default: 0,
    },
  },
  pushSubscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String,
    },
  },
}, {
  timestamps: true,
});

// Message Schema
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: false,  // Allow empty content when image is present
    default: '',
  },
  image: {
    publicId: String,
    url: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  _id: true,
});

// Chat Schema
const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  messages: [messageSchema],
  isArchived: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  pushSubscription: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
userSchema.index({ providerId: 1, provider: 1 });
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, isArchived: 1, createdAt: -1 });

// Export models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);