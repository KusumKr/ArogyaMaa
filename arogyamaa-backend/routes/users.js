// routes/users.js - NEW User management
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user profile
router.post('/users/profile', async (req, res) => {
  try {
    const { name, email, phone, trimester, dueDate, language, region, preferences } = req.body;

    // Validation
    if (!name || (!email && !phone)) {
      return res.status(400).json({ 
        error: 'Name and either email or phone are required' 
      });
    }

    // Find existing user or create new
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (user) {
      // Update existing user
      user.name = name;
      user.trimester = trimester || user.trimester;
      user.dueDate = dueDate || user.dueDate;
      user.language = language || user.language;
      user.region = region || user.region;
      if (preferences) user.preferences = { ...user.preferences, ...preferences };
      user.lastActive = new Date();
      
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        phone,
        trimester: trimester || '1',
        dueDate,
        language: language || 'en',
        region: region || 'north',
        preferences: preferences || {}
      });
      
      await user.save();
    }

    res.json({
      ok: true,
      message: user.isNew ? 'Profile created' : 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        trimester: user.trimester,
        language: user.language
      }
    });

  } catch (error) {
    console.error('Error in /api/users/profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get user profile
router.get('/users/profile/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { _id: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Error in /api/users/profile/:identifier:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get personalized recommendations
router.get('/users/:userId/recommendations', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const Tip = require('../models/Tip');

    // Get tips based on user preferences
    const tips = await Tip.find({
      trimester: user.trimester,
      language: user.language,
      active: true
    })
    .sort({ helpful: -1 }) // Most helpful first
    .limit(10);

    res.json({
      recommendations: tips,
      userProfile: {
        trimester: user.trimester,
        language: user.language,
        region: user.region
      }
    });

  } catch (error) {
    console.error('Error in /api/users/:userId/recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;