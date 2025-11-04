// models/UserSession.js - Track user sessions
const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    },
    trimester: {
      type: String,
      enum: ['1', '2', '3', 'postpartum'],
      default: '1'
    },
    region: {
      type: String,
      enum: ['north', 'south', 'east', 'west'],
      default: 'north'
    },
    voiceEnabled: {
      type: Boolean,
      default: false
    }
  },
  activity: {
    tipsViewed: {
      type: Number,
      default: 0
    },
    messagesCount: {
      type: Number,
      default: 0
    },
    feedbackGiven: {
      type: Number,
      default: 0
    },
    lastTipViewed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tip'
    }
  },
  device: {
    type: String,
    userAgent: String,
    ip: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days
  }
});

// Auto-delete expired sessions
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
UserSessionSchema.index({ userId: 1 });

module.exports = mongoose.model('UserSession', UserSessionSchema);