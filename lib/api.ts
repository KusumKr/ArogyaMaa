type Trimester = 'first' | 'second' | 'third';

export type FeedbackPayload = {
  trimester?: Trimester;
  language?: string;
  tipId?: string;
  helpful: boolean;
  notes?: string;
};

// Prefer proxying through Next.js API to avoid CORS during development and production
const NEXT_API_BASE = '';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

const api = {
  async submitFeedback(payload: FeedbackPayload) {
    const res = await fetch(`${NEXT_API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};

export default api;

