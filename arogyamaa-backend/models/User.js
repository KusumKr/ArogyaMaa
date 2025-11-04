// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  trimester: {
    type: String,
    enum: ['1', '2', '3', 'postpartum'],
    default: '1'
  },
  dueDate: {
    type: Date
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  region: {
    type: String,
    enum: ['north', 'south', 'east', 'west'],
    default: 'north'
  },
  preferences: {
    dietType: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan'],
      default: 'vegetarian'
    },
    allergies: [String],
    interests: [String]
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('User', UserSchema);