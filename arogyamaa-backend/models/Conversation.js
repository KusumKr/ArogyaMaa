// models/Conversation.js - Store chat history
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  isVoice: {
    type: Boolean,
    default: false
  }
});

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [MessageSchema],
  metadata: {
    trimester: String,
    language: String,
    region: String,
    deviceType: String,
    userAgent: String
  },
  summary: {
    topicsDiscussed: [String],
    questionsAsked: Number,
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'mixed'],
      default: 'neutral'
    }
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'abandoned'],
    default: 'active'
  }
});

// Indexes for fast queries
ConversationSchema.index({ userId: 1, startedAt: -1 });
ConversationSchema.index({ 'metadata.trimester': 1 });
ConversationSchema.index({ lastActiveAt: -1 });

// Update lastActiveAt on message add
ConversationSchema.pre('save', function(next) {
  this.lastActiveAt = new Date();
  if (this.messages.length > 0) {
    this.summary.questionsAsked = this.messages.filter(m => m.role === 'user').length;
  }
  next();
});

module.exports = mongoose.model('Conversation', ConversationSchema);