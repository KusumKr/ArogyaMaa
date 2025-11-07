// routes/chat-enhanced.js - Complete working version
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load tips data
const tipsPath = path.join(__dirname, '../data/nutritionTips.json');
let nutritionTips = {};

try {
  nutritionTips = JSON.parse(fs.readFileSync(tipsPath, 'utf8'));
} catch (err) {
  console.error('Error loading nutritionTips.json:', err);
}

// In-memory sessions
const sessions = new Map();
const conversations = new Map();

// Helper: Generate session ID
function generateSessionId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Helper: Search tips from database
function searchTips(message, trimester, language) {
  const msgText = typeof message === 'string' ? message : String(message || '');
  const lowerMsg = msgText.toLowerCase();
  
  const tips = nutritionTips[trimester]?.[language] || nutritionTips[trimester]?.['en'] || [];
  
  if (tips.length === 0) {
    return language === 'hi' 
      ? 'कृपया अपने डॉक्टर से परामर्श लें।'
      : 'Please consult your doctor for personalized advice.';
  }

  // Simple keyword matching
  const keywords = ['eat', 'food', 'nutrition', 'iron', 'calcium', 'protein', 'vitamin', 'diet', 'health'];
  const hasKeyword = keywords.some(k => lowerMsg.includes(k));
  
  if (hasKeyword) {
    return tips[Math.floor(Math.random() * tips.length)];
  }
  
  return tips[0];
}

// Helper: Chat with AI (Using Groq - Free & Fast)
async function chatWithAI(messages, language, trimester) {
  // Try Groq first (free)
  if (process.env.GROQ_API_KEY) {
    try {
      const Groq = require('groq-sdk');
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });

      const systemPrompt = language === 'hi'
        ? `आप आरोग्यमाँ हैं, भारत में गर्भवती महिलाओं (तिमाही ${trimester}) के लिए एक स्वास्थ्य मार्गदर्शक। सटीक, सरल स्वास्थ्य और पोषण सलाह दें। उत्तर 80 शब्दों से कम रखें। गर्म और सहायक रहें।`
        : `You are ArogyaMaa, a compassionate health guide for pregnant women in India (trimester ${trimester}). Provide accurate, simple health and nutrition advice. Keep answers under 80 words. Be warm and supportive.`;

      const completion = await groq.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
    }))
  ],
  max_tokens: 150,
  temperature: 0.7
});


      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Groq error:', error.message);
      throw error;
    }
  }

 if (process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const systemPrompt = language === 'hi'
        ? `आप आरोग्यमाँ हैं, भारत में गर्भवती महिलाओं (तिमाही ${trimester}) के लिए एक स्वास्थ्य मार्गदर्शक। सटीक, सरल स्वास्थ्य और पोषण सलाह दें। उत्तर 80 शब्दों से कम रखें।`
        : `You are ArogyaMaa, a health guide for pregnant women in India (trimester ${trimester}). Provide simple health advice. Keep answers under 80 words.`;

      const completion = await groq.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
    }))
  ],
  max_tokens: 150,
  temperature: 0.7
});


      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI error:', error.message);
      throw error;
    }
  }

  throw new Error('No AI API key configured');
}
// POST /api/chat/session - Create or get session
router.post('/chat/session', (req, res) => {
  try {
    const { preferences = {} } = req.body;
    const sessionId = generateSessionId();
    
    sessions.set(sessionId, {
      id: sessionId,
      preferences: {
        language: preferences.language || 'en',
        trimester: preferences.trimester || '2',
        ...preferences
      },
      createdAt: new Date(),
      lastActiveAt: new Date()
    });

    res.json({
      ok: true,
      sessionId,
      preferences: sessions.get(sessionId).preferences
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// POST /api/chat/message - Send message
router.post('/chat/message', async (req, res) => {
  try {
    const { 
      sessionId, 
      message, 
      language = 'en',
      trimester = '2'
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId || generateSessionId(),
        preferences: { language, trimester },
        createdAt: new Date(),
        lastActiveAt: new Date()
      };
      sessions.set(session.id, session);
    }

    // Update session
    session.lastActiveAt = new Date();

    // Get or create conversation
    let conversation = conversations.get(sessionId) || [];
    
    // Add user message
    conversation.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    let reply = '';
    let source = 'static';

    // Try AI providers
    try {
      reply = await chatWithAI(
        conversation.slice(-6).map(m => ({ role: m.role, content: m.content })),
        language,
        trimester
      );
      source = 'ai';
    } catch (error) {
      console.warn('⚠️  All AI providers failed, using static fallback');
      console.warn('   Error:', error.message);
    }

    // Fallback to static tips
    if (!reply) {
      console.log('→ Using static tips');
      reply = searchTips(message, trimester, language);
      source = 'static';
    }

    // Add assistant reply
    conversation.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date()
    });

    // Save conversation (keep last 20 messages)
    conversations.set(sessionId, conversation.slice(-20));

    res.json({
      reply,
      source,
      sessionId: session.id,
      metadata: {
        trimester,
        language,
        messageCount: conversation.length
      }
    });

  } catch (error) {
    console.error('Error in /api/chat/message:', error);
    res.status(500).json({ 
      error: 'Oops! Something went wrong. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/chat/history/:sessionId - Get conversation history
router.get('/chat/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = conversations.get(sessionId) || [];
    
    res.json({
      messages: conversation.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }))
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE /api/chat/session/:sessionId - End session
router.delete('/chat/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    sessions.delete(sessionId);
    conversations.delete(sessionId);
    
    res.json({ ok: true, message: 'Session ended' });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

module.exports = router;