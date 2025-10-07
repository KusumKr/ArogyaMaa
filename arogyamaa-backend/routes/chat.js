const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { chatWithOpenAI } = require('../lib/openai');
const { translateText } = require('../lib/translate');

const tipsPath = path.join(__dirname, '../data/nutritionTips.json');
let nutritionTips = {};

try {
  nutritionTips = JSON.parse(fs.readFileSync(tipsPath, 'utf8'));
} catch (err) {
  console.error('Error loading nutritionTips.json:', err);
}

function searchTipsForChat(message) {
  const lowerMessage = message.toLowerCase();
  
  let matchedTrimester = '2'; // default
  
  if (lowerMessage.includes('first') || lowerMessage.includes('1')) matchedTrimester = '1';
  if (lowerMessage.includes('second') || lowerMessage.includes('2')) matchedTrimester = '2';
  if (lowerMessage.includes('third') || lowerMessage.includes('3')) matchedTrimester = '3';

  const tips = nutritionTips[matchedTrimester]?.['en'] || [];
  
  if (tips.length === 0) {
    return "Stay hydrated, eat balanced meals with plenty of fruits and vegetables.";
  }

  return tips[Math.floor(Math.random() * tips.length)];
}

router.post('/chat', async (req, res) => {
  try {
    const { messages, language = 'en' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    let reply = '';
    let source = 'static';

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const userQuestion = lastUserMessage?.content || '';

    if (process.env.OPENAI_API_KEY) {
      try {
        reply = await chatWithOpenAI(messages, language);
        source = 'openai';
      } catch (error) {
        console.warn('OpenAI chat failed:', error.message);
      }
    }

    if (!reply) {
      const englishReply = searchTipsForChat(userQuestion);
      
      if (language !== 'en') {
        reply = await translateText(englishReply, language);
      } else {
        reply = englishReply;
      }
      source = 'static';
    }

    res.json({ reply, source, language });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

module.exports = router;