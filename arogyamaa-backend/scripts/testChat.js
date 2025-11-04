// scripts/testChat.js - Test enhanced chat
require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function testChat() {
  try {
    console.log('🧪 Testing Enhanced Chat API\n');

    // 1. Create session
    console.log('1️⃣ Creating session...');
    const sessionRes = await axios.post(`${API_URL}/api/chat/session`, {
      preferences: {
        language: 'en',
        trimester: '2'
      }
    });
    const sessionId = sessionRes.data.sessionId;
    console.log(`✅ Session created: ${sessionId}\n`);

    // 2. Send message
    console.log('2️⃣ Sending message...');
    const msgRes = await axios.post(`${API_URL}/api/chat/message`, {
      sessionId,
      message: 'What foods are good for iron?',
      language: 'en',
      trimester: '2'
    });
    console.log(`✅ Reply: ${msgRes.data.reply.substring(0, 100)}...`);
    console.log(`   Source: ${msgRes.data.source}`);
    console.log(`   Topics: ${msgRes.data.metadata.topics.join(', ')}\n`);

    // 3. Get history
    console.log('3️⃣ Getting history...');
    const historyRes = await axios.get(`${API_URL}/api/chat/history/${sessionId}`);
    console.log(`✅ History: ${historyRes.data.messages.length} messages\n`);

    // 4. Send another message (test context)
    console.log('4️⃣ Sending follow-up...');
    const followUpRes = await axios.post(`${API_URL}/api/chat/message`, {
      sessionId,
      message: 'What about calcium?',
      language: 'en'
    });
    console.log(`✅ Reply: ${followUpRes.data.reply.substring(0, 100)}...\n`);

    console.log('✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testChat();