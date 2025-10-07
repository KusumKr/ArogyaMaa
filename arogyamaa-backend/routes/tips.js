const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { translateText } = require('../lib/translate');
const { enhanceWithOpenAI } = require('../lib/openai');
const { getFromCache, setInCache } = require('../lib/cache');

const tipsPath = path.join(__dirname, '../data/nutritionTips.json');
let nutritionTips = {};

try {
  nutritionTips = JSON.parse(fs.readFileSync(tipsPath, 'utf8'));
} catch (err) {
  console.error('Error loading nutritionTips.json:', err);
}

function validateTipRequest(body) {
  const { trimester, language, question } = body;
  const errors = [];

  if (!trimester || !['1', '2', '3'].includes(trimester)) {
    errors.push('Trimester must be 1, 2, or 3');
  }
  if (!language || !['en', 'hi'].includes(language)) {
    errors.push('Language must be "en" or "hi"');
  }
  if (!question || question.length < 3) {
    errors.push('Question must be at least 3 characters');
  }
  return errors;
}

function getRandomTip(tips) {
  return tips[Math.floor(Math.random() * tips.length)];
}

function getDeterministicTip(tips, date, language) {
  const hash = crypto.createHash('md5').update(`${date}-${language}`).digest('hex');
  const index = parseInt(hash.substring(0, 8), 16) % tips.length;
  return tips[index];
}

// GET /api/languages
router.get('/languages', (req, res) => {
  res.json({ languages: ['en', 'hi'] });
});

// GET /api/regions
router.get('/regions', (req, res) => {
  res.json({ regions: ['north', 'south', 'east', 'west'] });
});

// POST /api/get-tip
router.post('/get-tip', async (req, res) => {
  try {
    const { trimester, language, question, region } = req.body;

    const validationErrors = validateTipRequest(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const cacheKey = `tip-${trimester}-${language}-${region || 'default'}-${question.substring(0, 50)}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    let tip = '';
    let source = 'static';

    const trimesterTips = nutritionTips[trimester];
    if (!trimesterTips) {
      return res.status(400).json({ error: 'Invalid trimester' });
    }

    let tips = trimesterTips[language];
    
    if (!tips || tips.length === 0) {
      tips = trimesterTips['en'] || [];
      if (tips.length > 0) {
        const englishTip = getRandomTip(tips);
        tip = await translateText(englishTip, language);
        source = 'static-translated';
      }
    } else {
      tip = getRandomTip(tips);
    }

    if (process.env.OPENAI_API_KEY && question.length > 20) {
      try {
        const enhanced = await enhanceWithOpenAI(question, trimester, language, tip);
        if (enhanced) {
          tip = enhanced;
          source = 'openai';
        }
      } catch (err) {
        console.warn('OpenAI failed:', err.message);
      }
    }

    const response = { tip, source, meta: { trimester, language, region: region || null } };
    setInCache(cacheKey, response, 600);
    res.json(response);

  } catch (error) {
    console.error('Error in /api/get-tip:', error);
    res.status(500).json({ error: 'Failed to fetch tip' });
  }
});

// GET /api/tip-of-day
router.get('/tip-of-day', async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    if (!['en', 'hi'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `tip-of-day-${today}-${language}`;

    const cached = getFromCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let allTips = [];
    for (const trimester of ['1', '2', '3']) {
      const tips = nutritionTips[trimester]?.[language] || [];
      allTips = allTips.concat(tips);
    }

    if (allTips.length === 0) {
      for (const trimester of ['1', '2', '3']) {
        const tips = nutritionTips[trimester]?.['en'] || [];
        allTips = allTips.concat(tips);
      }
      
      if (allTips.length > 0) {
        const englishTip = getDeterministicTip(allTips, today, language);
        const translatedTip = await translateText(englishTip, language);
        const response = { tip: translatedTip, date: today, language };
        setInCache(cacheKey, response, 86400);
        return res.json(response);
      }
    }

    const tip = getDeterministicTip(allTips, today, language);
    const response = { tip, date: today, language };
    setInCache(cacheKey, response, 86400);
    res.json(response);

  } catch (error) {
    console.error('Error in /api/tip-of-day:', error);
    res.status(500).json({ error: 'Failed to fetch tip of the day' });
  }
});

// GET /api/tips
router.get('/tips', async (req, res) => {
  try {
    const { trimester, language = 'en' } = req.query;

    if (!trimester || !['1', '2', '3'].includes(trimester)) {
      return res.status(400).json({ error: 'Invalid trimester' });
    }

    const tips = nutritionTips[trimester]?.[language] || [];

    if (tips.length === 0 && language !== 'en') {
      const englishTips = nutritionTips[trimester]?.['en'] || [];
      const translatedTips = await Promise.all(
        englishTips.map(tip => translateText(tip, language))
      );
      return res.json({ tips: translatedTips, trimester, language, translated: true });
    }

    res.json({ tips, trimester, language });

  } catch (error) {
    console.error('Error in /api/tips:', error);
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

// POST /api/admin/add-tip
router.post('/admin/add-tip', (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { trimester, language, text } = req.body;

    if (!trimester || !['1', '2', '3'].includes(trimester)) {
      return res.status(400).json({ error: 'Invalid trimester' });
    }

    if (!nutritionTips[trimester]) {
      nutritionTips[trimester] = {};
    }
    if (!nutritionTips[trimester][language]) {
      nutritionTips[trimester][language] = [];
    }

    nutritionTips[trimester][language].push(text);
    fs.writeFileSync(tipsPath, JSON.stringify(nutritionTips, null, 2));

    res.json({ ok: true, message: 'Tip added successfully' });

  } catch (error) {
    console.error('Error in /api/admin/add-tip:', error);
    res.status(500).json({ error: 'Failed to add tip' });
  }
});

module.exports = router;