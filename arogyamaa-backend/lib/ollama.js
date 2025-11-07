// lib/ollama.js - Ollama integration
const axios = require('axios');

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

/**
 * Chat with Ollama (Local AI)
 */
async function chatWithOllama(messages, language, trimester) {
  try {
    const systemPrompt = language === 'hi'
      ? `आप आरोग्यमाँ हैं, भारत में गर्भवती महिलाओं (तिमाही ${trimester}) के लिए स्वास्थ्य मार्गदर्शक। सटीक, सरल सलाह दें। 80 शब्दों से कम में जवाब दें।`
      : `You are ArogyaMaa, a compassionate health guide for pregnant women in India (trimester ${trimester}). Provide accurate, simple health and nutrition advice. Keep answers under 80 words. Be warm and supportive.`;

    // Build conversation prompt
    const conversation = messages.map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\n${conversation}\n\nAssistant:`;

    // Call Ollama API
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: 'phi3:mini', 
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 150 // Max tokens
      }
    }, {
      timeout: 30000 // 30 second timeout
    });

    return response.data.response.trim();

  } catch (error) {
    console.error('Ollama error:', error.message);
    throw error;
  }
}

/**
 * Check if Ollama is running
 */
async function isOllamaAvailable() {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
      timeout: 2000
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

module.exports = {
  chatWithOllama,
  isOllamaAvailable
};