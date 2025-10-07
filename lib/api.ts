type Trimester = 'first' | 'second' | 'third';

export type FeedbackPayload = {
  trimester?: Trimester;
  language?: string;
  tipId?: string;
  helpful: boolean;
  notes?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

const api = {
  async submitFeedback(payload: FeedbackPayload) {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};

export default api;

