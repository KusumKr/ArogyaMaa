/// lib/chatAPI.js - Frontend chat API client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error("❌ Backend URL not found. Check NEXT_PUBLIC_API_URL in .env.local");
}

class ChatAPI {
  constructor() {
    this.sessionId = null;
    this.loadSession();
  }

  loadSession() {
    if (typeof window !== 'undefined') {
      this.sessionId = localStorage.getItem('arogyamaa_session_id');
    }
  }

  saveSession(sessionId) {
    this.sessionId = sessionId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('arogyamaa_session_id', sessionId);
    }
  }

  async initSession() {
  const response = await fetch(`${API_BASE_URL}/api/chat/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device: "web"  // ✅ Required field
    }),
  });
  return response.json();
}

  async sendMessage(sessionId, message) {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message }),
    });
    return response.json();
  }

  async getHistory(limit = 50) {
    try {
      if (!this.sessionId) return { messages: [] };

      const response = await fetch(
        `${API_BASE_URL}/api/chat/history/${this.sessionId}?limit=${limit}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get history:', error);
      return { messages: [] };
    }
  }

  async endSession() {
    try {
      if (!this.sessionId) return;

      await fetch(`${API_BASE_URL}/api/chat/session/${this.sessionId}`, {
        method: 'DELETE'
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem('arogyamaa_session_id');
      }
      this.sessionId = null;
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  async submitFeedback(conversationId, rating, comment = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, rating, comment })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }
}

export const chatAPI = new ChatAPI();
export default chatAPI;
