// app/lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Get personalized tip
  async getTip(trimester, language, question, region = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/get-tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trimester, language, question, region })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tip');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get tip of the day
  async getTipOfDay(language = 'en') {
    const response = await fetch(
      `${API_BASE_URL}/api/tip-of-day?language=${language}`
    );
    return response.json();
  },

  // Get all tips for trimester
  async getAllTips(trimester, language) {
    const response = await fetch(
      `${API_BASE_URL}/api/tips?trimester=${trimester}&language=${language}`
    );
    return response.json();
  },

  // Submit feedback
  async submitFeedback(data) {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Chat with AI
  async chat(messages, language = 'en') {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, language })
    });
    return response.json();
  }
};

export default api;