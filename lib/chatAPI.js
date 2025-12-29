// lib/chatAPI.js - Frontend chat API client

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://arogyamaa.onrender.com";

if (!API_BASE_URL) {
  console.error("❌ Backend URL not found. Check NEXT_PUBLIC_API_URL in .env.local");
}

class ChatAPI {
  constructor() {
    this.sessionId = null;
    this.loadSession();
  }

  loadSession() {
    if (typeof window !== "undefined") {
      this.sessionId = localStorage.getItem("arogyamaa_session_id");
    }
  }

  saveSession(sessionId) {
    this.sessionId = sessionId;
    if (typeof window !== "undefined") {
      localStorage.setItem("arogyamaa_session_id", sessionId);
    }
  }

  // ✅ Updated to accept language & trimester
  async initSession({ language, trimester }) {
    // If we already have a sessionId, don't create a new one
    if (this.sessionId) {
      console.log("Using existing session:", this.sessionId);
      return { sessionId: this.sessionId };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device: "web",
          language,
          trimester,
        }),
      });

      const data = await response.json();
      if (data?.sessionId) {
        this.saveSession(data.sessionId);
        console.log("New session created:", data.sessionId);
      }
      return data;
    } catch (err) {
      console.error("Failed to init session:", err);
      // If backend fails, use existing sessionId or create a fallback
      if (!this.sessionId && typeof window !== "undefined") {
        const existing = localStorage.getItem("arogyamaa_session_id");
        if (existing) {
          this.sessionId = existing;
          console.log("Using existing sessionId from localStorage:", existing);
        } else {
          // Create a fallback sessionId
          const fallbackId = `local_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
          this.saveSession(fallbackId);
          console.log("Created fallback sessionId:", fallbackId);
        }
      }
      return { sessionId: this.sessionId };
    }
  }

  // ✅ Pass message + context (language, trimester)
  async sendMessage(message, { language, trimester }) {
    if (!this.sessionId) {
      console.warn("⚠️ No session found, starting new one...");
      await this.initSession({ language, trimester });
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: this.sessionId,
        message,
        language,
        trimester,
      }),
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
      console.error("Failed to get history:", error);
      return { messages: [] };
    }
  }

  async endSession() {
    try {
      if (!this.sessionId) return;

      await fetch(`${API_BASE_URL}/api/chat/session/${this.sessionId}`, {
        method: "DELETE",
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem("arogyamaa_session_id");
      }
      this.sessionId = null;
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  }

  async submitFeedback(conversationId, rating, comment = "") {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, rating, comment }),
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      throw error;
    }
  }
}

export const chatAPI = new ChatAPI();
export default chatAPI;
