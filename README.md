# ArogyaMaa

Modern, multilingual maternal wellness companion.

This repository contains:

- **Frontend**: Next.js app in `./` with Tailwind CSS and shadcn/ui components.
- **Backend**: Express server in `arogyamaa-backend/` that serves tips, chat, and feedback APIs.

---

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, shadcn/ui, lucide-react
- **Backend**: Node.js + Express, CORS, express-rate-limit, OpenAI SDK (optional)

## Project Structure
```
.
├─ app/                     # Next.js app router pages
├─ components/              # UI components
├─ public/                  # Static assets (e.g., mainlogo.png)
├─ styles/                  # Global styles
├─ lib/                     # Frontend libs (e.g., api.ts)
└─ arogyamaa-backend/       # Express backend
   ├─ routes/               # API routes (tips, feedback, chat)
   ├─ lib/                  # OpenAI helpers
   └─ server.js             # Backend entry
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm, npm, or yarn

### 1) Frontend (Next.js)
```bash
# from repo root
pnpm install   # or npm install / yarn
pnpm dev       # or npm run dev / yarn dev
```

The app runs at http://localhost:3000 by default.

Create `./.env.local` (Frontend) to point to the backend:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 2) Backend (Express)
```bash
cd arogyamaa-backend
pnpm install   # or npm install / yarn
node server.js # starts on PORT (5000 by default)
```

Create `./arogyamaa-backend/.env` (Backend):
```
# Port to run the API
PORT=5000

# Comma-separated list of allowed frontends for CORS
FRONTEND_ORIGINS=http://localhost:3000

# Optional: enable OpenAI-powered answers
OPENAI_API_KEY=sk-...
```

## Frontend–Backend Integration
The frontend posts feedback through `lib/api.ts` to the backend.

- Endpoint base URL is read from `NEXT_PUBLIC_BACKEND_URL`.
- Feedback API: `POST /api/feedback`
  - Example payload used by `TipOfTheDay` (`components/tip-of-the-day.tsx`):
    ```json
    { "trimester": "first|second|third", "helpful": true, "notes": "" }
    ```

Other backend endpoints:
- `GET /api/health` – health check
- `GET /api/tips` – nutrition/wellness tips
- `POST /api/chat` – chat endpoint (requires `OPENAI_API_KEY`)

## Scripts
Frontend (from repo root `package.json`):
- `dev` – start Next dev server
- `build` – production build
- `start` – run built app
- `lint` – run Next.js lint

Backend:
- Start with `node arogyamaa-backend/server.js` (or add a script in a backend-specific package.json if desired)

## Deploy
- Frontend: Deploy to Vercel/Netlify. Ensure `NEXT_PUBLIC_BACKEND_URL` is set to your backend URL.
- Backend: Deploy to your Node host (Render, Railway, Fly.io, VPS, etc.). Configure `FRONTEND_ORIGINS` with your frontend domain for CORS.

## Troubleshooting
- **Favicon not updating**: Browsers cache favicons. Try hard refresh (Ctrl+F5), private window, or change the file name temporarily.
- **Logo box visible**: If your logo image contains an embedded background, prefer a transparent PNG/SVG for perfect blending. The hero view uses masking/clipping to minimize artifacts, but a transparent source asset works best.
- **CORS errors**: Confirm `FRONTEND_ORIGINS` includes your frontend URL and matches the protocol/host/port exactly.
- **Feedback API errors**: Ensure backend is running and `NEXT_PUBLIC_BACKEND_URL` points to it.

## License
Private project. All rights reserved.