// routes/progress.js - MongoDB-backed progress tracking endpoints
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// In-memory fallback (if MongoDB unavailable)
const progressStore = new Map();

// Helper: Get or create progress from MongoDB
async function getProgress(sessionId) {
  try {
    let progress = await Progress.findOne({ sessionId });
    
    if (!progress) {
      // Create new progress document
      progress = new Progress({
        sessionId,
        metrics: {
          totalMessages: 0,
          totalTipsViewed: 0,
          totalDaysActive: 1,
          totalVoiceInteractions: 0,
          totalFeedbackGiven: 0,
          lastActiveDate: new Date().toISOString().split('T')[0],
          streakDays: 1,
          longestStreak: 1
        },
        achievements: [],
        milestones: [],
        bookmarkedTips: [],
        healthJournal: [],
        reminders: []
      });
      await progress.save();
    }
    
    return progress;
  } catch (error) {
    console.error('MongoDB error, using in-memory fallback:', error.message);
    // Fallback to in-memory storage
    if (!progressStore.has(sessionId)) {
      progressStore.set(sessionId, {
        metrics: {
          totalMessages: 0,
          totalTipsViewed: 0,
          totalDaysActive: 1,
          totalVoiceInteractions: 0,
          totalFeedbackGiven: 0,
          lastActiveDate: new Date().toISOString().split('T')[0],
          streakDays: 1,
          longestStreak: 1
        },
        achievements: [],
        milestones: [],
        bookmarkedTips: [],
        healthJournal: [],
        reminders: []
      });
    }
    return progressStore.get(sessionId);
  }
}

// GET /api/progress/:sessionId - Get user progress
router.get('/progress/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const progress = await getProgress(sessionId);
    
    // Convert MongoDB document to plain object
    const progressData = progress.toObject ? progress.toObject() : progress;
    
    res.json({
      ok: true,
      progress: progressData
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/progress/:sessionId/track - Track activity
router.post('/progress/:sessionId/track', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { activity, data } = req.body;
    
    const progress = await getProgress(sessionId);
    const today = new Date().toISOString().split('T')[0];
    const lastActive = progress.metrics.lastActiveDate 
      ? new Date(progress.metrics.lastActiveDate).toISOString().split('T')[0]
      : today;
    
    // Update streak
    if (today !== lastActive) {
      const yesterday = new Date(lastActive);
      yesterday.setDate(yesterday.getDate() + 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (today === yesterdayStr) {
        progress.metrics.streakDays = (progress.metrics.streakDays || 1) + 1;
        if (progress.metrics.streakDays > (progress.metrics.longestStreak || 1)) {
          progress.metrics.longestStreak = progress.metrics.streakDays;
        }
      } else {
        progress.metrics.streakDays = 1;
      }
      
      progress.metrics.totalDaysActive = (progress.metrics.totalDaysActive || 1) + 1;
      progress.metrics.lastActiveDate = today;
    }
    
    // Track specific activities
    switch (activity) {
      case 'message':
        progress.metrics.totalMessages = (progress.metrics.totalMessages || 0) + 1;
        break;
      case 'tip':
        progress.metrics.totalTipsViewed = (progress.metrics.totalTipsViewed || 0) + 1;
        break;
      case 'voice':
        progress.metrics.totalVoiceInteractions = (progress.metrics.totalVoiceInteractions || 0) + 1;
        break;
      case 'feedback':
        progress.metrics.totalFeedbackGiven = (progress.metrics.totalFeedbackGiven || 0) + 1;
        break;
    }
    
    // Check for achievements
    checkAchievements(progress);
    
    // Save to MongoDB
    if (progress.save) {
      await progress.save();
    } else {
      // In-memory fallback
      progressStore.set(sessionId, progress);
    }
    
    const progressData = progress.toObject ? progress.toObject() : progress;
    
    res.json({
      ok: true,
      progress: progressData
    });
  } catch (error) {
    console.error('Error tracking progress:', error);
    res.status(500).json({ error: 'Failed to track progress' });
  }
});

// POST /api/progress/:sessionId/bookmark - Bookmark a tip
router.post('/progress/:sessionId/bookmark', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { tipId, tipContent, category } = req.body;
    
    const progress = await getProgress(sessionId);
    
    // Check if already bookmarked
    const exists = progress.bookmarkedTips.find(t => t.tipId === tipId);
    if (exists) {
      const progressData = progress.toObject ? progress.toObject() : progress;
      return res.json({ ok: true, message: 'Already bookmarked', progress: progressData });
    }
    
    progress.bookmarkedTips.push({
      tipId,
      tipContent,
      category: category || 'general',
      bookmarkedAt: new Date()
    });
    
    // Save to MongoDB
    if (progress.save) {
      await progress.save();
    } else {
      progressStore.set(sessionId, progress);
    }
    
    const progressData = progress.toObject ? progress.toObject() : progress;
    
    res.json({
      ok: true,
      message: 'Tip bookmarked successfully',
      progress: progressData
    });
  } catch (error) {
    console.error('Error bookmarking tip:', error);
    res.status(500).json({ error: 'Failed to bookmark tip' });
  }
});

// DELETE /api/progress/:sessionId/bookmark/:tipId - Remove bookmark
router.delete('/progress/:sessionId/bookmark/:tipId', async (req, res) => {
  try {
    const { sessionId, tipId } = req.params;
    const progress = await getProgress(sessionId);
    
    progress.bookmarkedTips = progress.bookmarkedTips.filter(t => t.tipId !== tipId);
    
    // Save to MongoDB
    if (progress.save) {
      await progress.save();
    } else {
      progressStore.set(sessionId, progress);
    }
    
    const progressData = progress.toObject ? progress.toObject() : progress;
    
    res.json({
      ok: true,
      message: 'Bookmark removed',
      progress: progressData
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

// POST /api/progress/:sessionId/journal - Add health journal entry
router.post('/progress/:sessionId/journal', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { mood, symptoms, weight, notes, energyLevel, sleepHours } = req.body;
    
    const progress = await getProgress(sessionId);
    
    progress.healthJournal.push({
      date: new Date(),
      mood: mood || 'neutral',
      symptoms: symptoms || [],
      weight,
      notes,
      energyLevel: energyLevel || 5,
      sleepHours
    });
    
    // Save to MongoDB
    if (progress.save) {
      await progress.save();
    } else {
      progressStore.set(sessionId, progress);
    }
    
    const progressData = progress.toObject ? progress.toObject() : progress;
    
    res.json({
      ok: true,
      message: 'Journal entry added',
      progress: progressData
    });
  } catch (error) {
    console.error('Error adding journal entry:', error);
    res.status(500).json({ error: 'Failed to add journal entry' });
  }
});

// GET /api/progress/:sessionId/journal - Get health journal
router.get('/progress/:sessionId/journal', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 30 } = req.query;
    
    const progress = await getProgress(sessionId);
    const journal = progress.healthJournal
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, parseInt(limit));
    
    res.json({
      ok: true,
      journal
    });
  } catch (error) {
    console.error('Error fetching journal:', error);
    res.status(500).json({ error: 'Failed to fetch journal' });
  }
});

// POST /api/progress/:sessionId/reminder - Add reminder
router.post('/progress/:sessionId/reminder', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title, description, type, dueDate } = req.body;
    
    const progress = await getProgress(sessionId);
    
    progress.reminders.push({
      title,
      description,
      type: type || 'other',
      dueDate: new Date(dueDate),
      completed: false,
      createdAt: new Date()
    });
    
    // Save to MongoDB
    if (progress.save) {
      await progress.save();
    } else {
      progressStore.set(sessionId, progress);
    }
    
    const progressData = progress.toObject ? progress.toObject() : progress;
    
    res.json({
      ok: true,
      message: 'Reminder added',
      progress: progressData
    });
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ error: 'Failed to add reminder' });
  }
});

// GET /api/progress/:sessionId/reminders - Get reminders
router.get('/progress/:sessionId/reminders', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { completed } = req.query;
    
    const progress = await getProgress(sessionId);
    let reminders = progress.reminders || [];
    
    if (completed !== undefined) {
      reminders = reminders.filter(r => r.completed === (completed === 'true'));
    }
    
    // Sort by due date
    reminders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    res.json({
      ok: true,
      reminders
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// PUT /api/progress/:sessionId/reminder/:reminderId - Update reminder
router.put('/progress/:sessionId/reminder/:reminderId', async (req, res) => {
  try {
    const { sessionId, reminderId } = req.params;
    const { completed, ...updates } = req.body;
    
    const progress = await getProgress(sessionId);
    const reminder = progress.reminders.find(r => 
      r._id?.toString() === reminderId || 
      r.title === reminderId ||
      r._id === reminderId
    );
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    Object.assign(reminder, updates);
    if (completed !== undefined) {
      reminder.completed = completed;
      reminder.completedAt = completed ? new Date() : null;
    }
    
    // Save to MongoDB
    if (progress.save) {
      await progress.save();
    } else {
      progressStore.set(sessionId, progress);
    }
    
    res.json({
      ok: true,
      message: 'Reminder updated',
      reminder
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

// Helper: Check and award achievements
function checkAchievements(progress) {
  const achievements = progress.achievements || [];
  const existingBadgeIds = achievements.map(a => a.badgeId).filter(Boolean);
  const metrics = progress.metrics || {};
  
  // First Message
  if (metrics.totalMessages >= 1 && !existingBadgeIds.includes('first_message')) {
    progress.achievements.push({
      badgeId: 'first_message',
      badgeName: 'First Step',
      description: 'Sent your first message',
      category: 'engagement',
      unlockedAt: new Date()
    });
  }
  
  // Chatty
  if (metrics.totalMessages >= 10 && !existingBadgeIds.includes('chatty')) {
    progress.achievements.push({
      badgeId: 'chatty',
      badgeName: 'Chatty',
      description: 'Sent 10 messages',
      category: 'engagement',
      unlockedAt: new Date()
    });
  }
  
  // Social Butterfly
  if (metrics.totalMessages >= 50 && !existingBadgeIds.includes('social_butterfly')) {
    progress.achievements.push({
      badgeId: 'social_butterfly',
      badgeName: 'Social Butterfly',
      description: 'Sent 50 messages',
      category: 'engagement',
      unlockedAt: new Date()
    });
  }
  
  // Tip Collector
  if (metrics.totalTipsViewed >= 5 && !existingBadgeIds.includes('tip_collector')) {
    progress.achievements.push({
      badgeId: 'tip_collector',
      badgeName: 'Tip Collector',
      description: 'Viewed 5 tips',
      category: 'knowledge',
      unlockedAt: new Date()
    });
  }
  
  // Knowledge Seeker
  if (metrics.totalTipsViewed >= 20 && !existingBadgeIds.includes('knowledge_seeker')) {
    progress.achievements.push({
      badgeId: 'knowledge_seeker',
      badgeName: 'Knowledge Seeker',
      description: 'Viewed 20 tips',
      category: 'knowledge',
      unlockedAt: new Date()
    });
  }
  
  // Voice User
  if (metrics.totalVoiceInteractions >= 5 && !existingBadgeIds.includes('voice_user')) {
    progress.achievements.push({
      badgeId: 'voice_user',
      badgeName: 'Voice User',
      description: 'Used voice 5 times',
      category: 'engagement',
      unlockedAt: new Date()
    });
  }
  
  // Streak Master
  if (metrics.streakDays >= 7 && !existingBadgeIds.includes('streak_week')) {
    progress.achievements.push({
      badgeId: 'streak_week',
      badgeName: 'Week Warrior',
      description: '7 day streak',
      category: 'engagement',
      unlockedAt: new Date()
    });
  }
  
  // Dedicated
  if (metrics.streakDays >= 30 && !existingBadgeIds.includes('dedicated')) {
    progress.achievements.push({
      badgeId: 'dedicated',
      badgeName: 'Dedicated',
      description: '30 day streak',
      category: 'engagement',
      unlockedAt: new Date()
    });
  }
}

module.exports = router;
