// models/Tip.js
const mongoose = require('mongoose');

const TipSchema = new mongoose.Schema({
  trimester: {
    type: String,
    required: true,
    enum: ['1', '2', '3']
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'hi']
  },
  region: {
    type: String,
    enum: ['north', 'south', 'east', 'west', null],
    default: null
  },
  text: {
    type: String,
    required: true,
    minlength: 10
  },
  category: {
    type: String,
    enum: ['nutrition', 'exercise', 'wellness', 'safety', 'general'],
    default: 'general'
  },
  tags: [{
    type: String
  }],
  active: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
TipSchema.index({ trimester: 1, language: 1, active: 1 });
TipSchema.index({ category: 1 });
TipSchema.index({ tags: 1 });

module.exports = mongoose.model('Tip', TipSchema);