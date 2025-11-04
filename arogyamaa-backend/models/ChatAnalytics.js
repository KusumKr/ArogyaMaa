// models/ChatAnalytics.js - Track popular questions and topics
const mongoose = require('mongoose');

const ChatAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  trimester: {
    type: String,
    enum: ['1', '2', '3', 'postpartum', 'all']
  },
  language: {
    type: String,
    enum: ['en', 'hi']
  },
  metrics: {
    totalConversations: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    avgMessagesPerConversation: {
      type: Number,
      default: 0
    },
    voiceInteractions: {
      type: Number,
      default: 0
    },
    uniqueUsers: {
      type: Number,
      default: 0
    }
  },
  popularQuestions: [{
    question: String,
    count: Number,
    category: String
  }],
  popularTopics: [{
    topic: String,
    count: Number
  }],
  userSatisfaction: {
    positive: {
      type: Number,
      default: 0
    },
    neutral: {
      type: Number,
      default: 0
    },
    negative: {
      type: Number,
      default: 0
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
ChatAnalyticsSchema.index({ date: -1, trimester: 1, language: 1 });

module.exports = mongoose.model('ChatAnalytics', ChatAnalyticsSchema);