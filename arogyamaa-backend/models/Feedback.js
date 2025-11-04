// models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  tipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tip',
    default: null
  },
  trimester: {
    type: String,
    enum: ['1', '2', '3', null],
    default: null
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  helpful: {
    type: Boolean,
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for analytics
FeedbackSchema.index({ helpful: 1, createdAt: -1 });
FeedbackSchema.index({ trimester: 1 });
FeedbackSchema.index({ tipId: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);