// models/Progress.js - Track user progress and engagement
const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  metrics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    totalTipsViewed: {
      type: Number,
      default: 0
    },
    totalDaysActive: {
      type: Number,
      default: 1
    },
    totalVoiceInteractions: {
      type: Number,
      default: 0
    },
    totalFeedbackGiven: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    streakDays: {
      type: Number,
      default: 1
    },
    longestStreak: {
      type: Number,
      default: 1
    }
  },
  achievements: [{
    badgeId: String,
    badgeName: String,
    description: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['engagement', 'health', 'knowledge', 'community'],
      default: 'engagement'
    }
  }],
  milestones: [{
    milestoneId: String,
    milestoneName: String,
    description: String,
    completedAt: {
      type: Date,
      default: Date.now
    },
    trimester: String
  }],
  bookmarkedTips: [{
    tipId: String,
    tipContent: String,
    category: String,
    bookmarkedAt: {
      type: Date,
      default: Date.now
    }
  }],
  healthJournal: [{
    date: {
      type: Date,
      default: Date.now
    },
    mood: {
      type: String,
      enum: ['excited', 'happy', 'neutral', 'anxious', 'tired', 'stressed'],
      default: 'neutral'
    },
    symptoms: [String],
    weight: Number,
    notes: String,
    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    sleepHours: Number
  }],
  reminders: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['appointment', 'medication', 'checkup', 'test', 'other'],
      default: 'other'
    },
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
ProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
ProgressSchema.index({ sessionId: 1 });
ProgressSchema.index({ userId: 1 });
ProgressSchema.index({ 'metrics.lastActiveDate': -1 });

module.exports = mongoose.model('Progress', ProgressSchema);

