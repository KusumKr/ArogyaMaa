// routes/chat-enhanced.js - Enhanced chat with MongoDB
const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const UserSession = require('../models/UserSession');
const Tip = require('../models/Tip');
const { chatWithOpenAI } = require('../lib/openai');
const { translateText } = require('../lib/translate');
const crypto = require('crypto');

// Helper: Generate session ID
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

function extractTopics(message) {
  if (!message) return ['general'];

  // if message is object like { text: "hi" }
  if (typeof message !== "string") {
    if (message.text) message = message.text;
    else message = JSON.stringify(message);
  }

  const keywords = {
    nutrition: ['eat', 'food', 'diet', 'nutrition', 'vitamin', 'iron', 'calcium'],
    exercise: ['exercise', 'walk', 'yoga', 'active', 'movement'],
    wellness: ['sleep', 'rest', 'stress', 'mental', 'mood'],
    safety: ['avoid', 'danger', 'safe', 'risk', 'warning'],
    symptoms: ['pain', 'nausea', 'tired', 'sick', 'feeling']
  };

  const topics = [];
  const lowerMsg = message.toLowerCase();

  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMsg.includes(word))) {
      topics.push(topic);
    }
  }

  return topics.length > 0 ? topics : ['general'];
}

// POST /api/chat/session - Create or get session
router.post('/chat/session', async (req, res) => {
  try {
    const { sessionId, preferences, device } = req.body;

    let session;

    if (sessionId) {
      // Find existing session
      session = await UserSession.findOne({ sessionId });
      
      if (session) {
        session.lastActiveAt = new Date();
        if (preferences) {
          session.preferences = { ...session.preferences, ...preferences };
        }
        await session.save();
      }
    }

    if (!session) {
      // Create new session
      session = new UserSession({
        sessionId: generateSessionId(),
        preferences: preferences || {},
        device: device || {}
      });
      await session.save();
    }

    res.json({
      ok: true,
      sessionId: session.sessionId,
      preferences: session.preferences
    });

  } catch (error) {
    console.error('Error in /api/chat/session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// POST /api/chat/message - Send message (ENHANCED)
router.post('/chat/message', async (req, res) => {
  try {
    const { 
      sessionId, 
      message, 
      language = 'en',
      trimester = '2',
      isVoice = false,
      context = {}
    } = req.body;

    // Validation
    if (!sessionId || !message) {
      return res.status(400).json({ 
        error: 'sessionId and message are required' 
      });
    }

    // Get or create session
    let session = await UserSession.findOne({ sessionId });
    if (!session) {
      session = new UserSession({
        sessionId,
        preferences: { language, trimester }
      });
      await session.save();
    }

    // Update session activity
    session.activity.messagesCount += 1;
    session.lastActiveAt = new Date();
    await session.save();

    // Get or create conversation
    let conversation = await Conversation.findOne({ 
      sessionId,
      status: 'active'
    });

    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        metadata: {
          trimester,
          language,
          region: session.preferences.region,
          userAgent: req.headers['user-agent']
        }
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message,
      language,
      isVoice
    });

    // Extract topics for analytics
    const topics = extractTopics(message);
    conversation.summary.topicsDiscussed = [
      ...new Set([...conversation.summary.topicsDiscussed, ...topics])
    ];

    let reply = '';
    let source = 'static';
    let relatedTips = [];

    // Try OpenAI first
    if (process.env.OPENAI_API_KEY) {
      try {
        // Build conversation history for context
        const conversationHistory = conversation.messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        reply = await chatWithOpenAI(conversationHistory, language);
        source = 'openai';
      } catch (error) {
        console.warn('OpenAI failed, using fallback:', error.message);
      }
    }

    // Fallback: Search tips from database
    if (!reply) {
      try {
        // Smart search based on message content and topics
        const tips = await Tip.find({
          trimester,
          language,
          active: true,
          $or: [
            { category: { $in: topics } },
            { tags: { $in: topics } }
          ]
        })
        .sort({ helpful: -1, views: -1 })
        .limit(3);

        if (tips.length > 0) {
          reply = tips[0].text;
          relatedTips = tips.slice(1).map(tip => ({
            id: tip._id,
            text: tip.text.substring(0, 100) + '...',
            category: tip.category
          }));
          source = 'database';

          // Increment views
          await Tip.updateOne(
            { _id: tips[0]._id },
            { $inc: { views: 1 } }
          );
        } else {
          // Generic fallback
          reply = language === 'hi' 
            ? 'कृपया अपने डॉक्टर से सलाह लें। हर गर्भावस्था अद्वितीय होती है।'
            : 'Please consult your doctor for personalized advice. Every pregnancy is unique.';
          source = 'fallback';
        }
      } catch (error) {
        console.error('Database search failed:', error);
        reply = 'I apologize, but I encountered an error. Please try again.';
        source = 'error';
      }
    }

    // Translate if needed
    if (language !== 'en' && source === 'database') {
      try {
        reply = await translateText(reply, language);
      } catch (error) {
        console.warn('Translation failed:', error);
      }
    }

    // Add assistant reply to conversation
    conversation.messages.push({
      role: 'assistant',
      content: reply,
      language
    });

    // Save conversation
    await conversation.save();

    // Return response
    res.json({
      reply,
      source,
      relatedTips,
      conversationId: conversation._id,
      metadata: {
        topics,
        messageCount: conversation.messages.length
      }
    });

  } catch (error) {
    console.error('Error in /api/chat/message:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/chat/history - Get conversation history
router.get('/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const conversation = await Conversation.findOne({ 
      sessionId,
      status: 'active'
    });

    if (!conversation) {
      return res.json({ messages: [] });
    }

    const messages = conversation.messages
      .slice(-parseInt(limit))
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        language: msg.language,
        isVoice: msg.isVoice
      }));

    res.json({
      messages,
      metadata: conversation.metadata,
      summary: conversation.summary
    });

  } catch (error) {
    console.error('Error in /api/chat/history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE /api/chat/session - End session
router.delete('/chat/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // End conversation
    await Conversation.updateOne(
      { sessionId, status: 'active' },
      { status: 'ended', endedAt: new Date() }
    );

    // Delete session
    await UserSession.deleteOne({ sessionId });

    res.json({ ok: true, message: 'Session ended' });

  } catch (error) {
    console.error('Error in /api/chat/session delete:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// POST /api/chat/feedback - Rate conversation
router.post('/chat/feedback', async (req, res) => {
  try {
    const { conversationId, rating, comment } = req.body;

    const sentiment = rating >= 4 ? 'positive' : rating >= 3 ? 'neutral' : 'negative';

    await Conversation.updateOne(
      { _id: conversationId },
      { 
        'summary.sentiment': sentiment,
        'summary.feedback': { rating, comment }
      }
    );

    res.json({ ok: true, message: 'Feedback saved' });

  } catch (error) {
    console.error('Error in /api/chat/feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// GET /api/chat/analytics - Get chat analytics (Admin)
router.get('/chat/analytics', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { startDate, endDate, trimester, language } = req.query;

    const query = {};
    if (startDate) query.startedAt = { $gte: new Date(startDate) };
    if (endDate) query.startedAt = { ...query.startedAt, $lte: new Date(endDate) };
    if (trimester) query['metadata.trimester'] = trimester;
    if (language) query['metadata.language'] = language;

    const [
      totalConversations,
      totalMessages,
      activeConversations,
      avgMessagesPerConversation,
      topTopics
    ] = await Promise.all([
      Conversation.countDocuments(query),
      Conversation.aggregate([
        { $match: query },
        { $project: { messageCount: { $size: '$messages' } } },
        { $group: { _id: null, total: { $sum: '$messageCount' } } }
      ]),
      Conversation.countDocuments({ ...query, status: 'active' }),
      Conversation.aggregate([
        { $match: query },
        { $project: { messageCount: { $size: '$messages' } } },
        { $group: { _id: null, avg: { $avg: '$messageCount' } } }
      ]),
      Conversation.aggregate([
        { $match: query },
        { $unwind: '$summary.topicsDiscussed' },
        { $group: { _id: '$summary.topicsDiscussed', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      overview: {
        totalConversations,
        totalMessages: totalMessages[0]?.total || 0,
        activeConversations,
        avgMessagesPerConversation: Math.round(avgMessagesPerConversation[0]?.avg || 0)
      },
      topTopics: topTopics.map(t => ({ topic: t._id, count: t.count })),
      dateRange: { startDate, endDate }
    });

  } catch (error) {
    console.error('Error in /api/chat/analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;