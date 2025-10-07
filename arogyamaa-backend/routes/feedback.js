const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const feedbackPath = path.join(__dirname, '../data/feedback.json');

if (!fs.existsSync(feedbackPath)) {
  fs.writeFileSync(feedbackPath, JSON.stringify([], null, 2));
}

router.post('/feedback', async (req, res) => {
  try {
    const { trimester, language, tipId, helpful, notes } = req.body;

    if (typeof helpful !== 'boolean') {
      return res.status(400).json({ error: 'helpful must be boolean' });
    }

    let feedbackData = [];
    try {
      const data = fs.readFileSync(feedbackPath, 'utf8');
      feedbackData = JSON.parse(data);
    } catch (err) {
      console.warn('Could not read feedback file:', err.message);
    }

    const feedback = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      trimester: trimester || null,
      language: language || 'en',
      tipId: tipId || null,
      helpful,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      ip: req.ip
    };

    feedbackData.push(feedback);
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackData, null, 2));

    res.json({ ok: true, message: 'Feedback saved successfully', feedbackId: feedback.id });

  } catch (error) {
    console.error('Error in /api/feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

module.exports = router;