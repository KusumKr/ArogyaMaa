# 🌸 ArogyaMaa - Empowering Motherhood with Personalized Care

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://arogya-maa.vercel.app)

> A modern, AI-powered maternal wellness companion supporting pregnant women and new mothers across India with multilingual health guidance, personalized tips, and voice-enabled chat.

## ✨ Features

### 🎤 **Voice-Enabled Chat**
- Speech-to-text input in English and Hindi
- Text-to-speech responses for accessibility
- Natural conversation flow with context awareness

### 🌍 **Multilingual Support**
- English and Hindi interfaces
- Culturally sensitive health advice
- Regional dietary recommendations

### 🤖 **AI-Powered Guidance**
- Personalized tips based on trimester
- Context-aware health advice using GPT/Groq
- Fallback to curated static tips

### 💡 **Daily Wellness Tips**
- Trimester-specific nutrition advice
- Exercise recommendations
- Mental wellness support
- Safety guidelines

### 📊 **Progress Tracking**
- Conversation history
- Feedback system
- Session management

### 🔒 **Privacy & Security**
- CORS-protected API
- Rate limiting
- Secure data handling
- No personal data storage (MVP)

---

## 🏗️ Architecture

### **Tech Stack**

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Lucide React icons
- Web Speech API

**Backend:**
- Node.js + Express
- Groq AI (free tier)
- OpenAI (optional)
- In-memory session storage
- JSON-based tip database

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Domain: Custom domain ready

---

## 📁 Project Structure
```
arogyamaa/
├── app/                          # Next.js app router
│   ├── chat/                     # Chat page
│   ├── about/                    # About page
│   ├── features/                 # Features page
│   └── hooks/                    # Custom React hooks
│       └── useVoice.js          # Voice recognition hook
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui primitives
│   ├── chat-message.tsx         # Chat bubble component
│   ├── voice-button.tsx         # Voice input button
│   ├── tip-of-the-day.tsx      # Daily tip card
│   ├── navbar.tsx               # Navigation bar
│   └── footer.tsx               # Footer component
│
├── lib/                         # Frontend utilities
│   ├── chatAPI.js               # Backend API client
│   └── utils.ts                 # Helper functions
│
├── public/                      # Static assets
│   ├── mainlogo.png            # Logo
│   └── images/                 # Image assets
│
├── arogyamaa-backend/           # Express backend
│   ├── routes/
│   │   ├── tips.js             # Tips endpoints
│   │   ├── feedback.js         # Feedback endpoints
│   │   └── chat-enhanced.js    # AI chat endpoints
│   ├── lib/
│   │   ├── openai.js           # OpenAI wrapper
│   │   ├── translate.js        # Translation utilities
│   │   └── cache.js            # In-memory caching
│   ├── data/
│   │   ├── nutritionTips.json  # Static tip database
│   │   └── feedback.json       # Feedback storage
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env.example            # Environment template
│
├── .env.local                   # Frontend environment
├── package.json
└── README.md
```


## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- npm, pnpm, or yarn
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/KusumKr/ArogyaMaa.git
cd ArogyaMaa
```

### 2️⃣ Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Visit: http://localhost:3000

**`.env.local` (Frontend):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3️⃣ Backend Setup
```bash
# Navigate to backend
cd arogyamaa-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start backend server
npm start
```

Backend runs at: http://localhost:5000

**`.env` (Backend):**
```env
PORT=5000
NODE_ENV=development
FRONTEND_ORIGINS=http://localhost:3000,https://arogya-maa.vercel.app

# AI Providers (add at least one)
GROQ_API_KEY=gsk_your_groq_key_here
OPENAI_API_KEY=sk_your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here

# Optional
ADMIN_KEY=your_admin_secret_here
```

---

## 🔑 Getting API Keys (Free)

### **Groq (Recommended - Free)**
1. Visit: https://console.groq.com
2. Sign up (no credit card needed)
3. Create API key
4. Free tier: 14,400 requests/day

### **Google Gemini (Backup - Free)**
1. Visit: https://aistudio.google.com/apikey
2. Sign in with Google
3. Generate API key
4. Free tier: 60 requests/minute

### **OpenAI (Optional - Paid)**
1. Visit: https://platform.openai.com/api-keys
2. Sign up and add billing
3. Create API key
4. Pay-as-you-go pricing

---

## 🌐 API Endpoints

### **Base URL:** `https://arogyamaa.onrender.com/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/languages` | Supported languages |
| GET | `/regions` | Supported regions |
| POST | `/chat/session` | Create chat session |
| POST | `/chat/message` | Send chat message |
| GET | `/chat/history/:id` | Get conversation history |
| GET | `/tip-of-day` | Get daily tip |
| GET | `/tips` | Get all tips by trimester |
| POST | `/feedback` | Submit feedback |

**Example Request:**
```javascript
// Send chat message
const response = await fetch('https://arogyamaa.onrender.com/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session_123',
    message: 'What should I eat for iron?',
    language: 'en',
    trimester: '2'
  })
});

const data = await response.json();
console.log(data.reply); // AI response
```

---

## 📦 Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend
```bash
npm start            # Start backend server
npm run dev          # Start with nodemon (auto-reload)
npm test             # Run tests
```

---

## 🚀 Deployment

### **Frontend (Vercel)**

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set environment variables:
```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```
4. Deploy!

**Auto-deploys on every push to `main` branch.**

### **Backend (Render)**

1. Create Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Set build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables (see `.env.example`)
5. Deploy!

---

## 🎨 Customization

### **Add New Language**

1. Update `lib/translate.js`:
```javascript
const staticTranslations = {
  'en_to_ta': {  // Tamil
    'Stay hydrated': 'நீர்ச்சத்து பராமரிக்கவும்',
    // ... more translations
  }
};
```

2. Update language selector:
```typescript
<option value="ta">தமிழ்</option>
```

### **Add New Tips**

Edit `arogyamaa-backend/data/nutritionTips.json`:
```json
{
  "1": {
    "en": [
      "Your new tip here"
    ],
    "hi": [
      "आपकी नई सलाह यहाँ"
    ]
  }
}
```

---

## 🐛 Troubleshooting

### **Chat not working**
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check environment variables
echo $NEXT_PUBLIC_API_URL
```

### **Voice feature not working**
- Enable microphone permissions in browser
- Use HTTPS (required for voice on mobile)
- Check browser compatibility (Chrome/Edge recommended)

### **CORS errors**
```env
# Backend .env - make sure frontend URL is included
FRONTEND_ORIGINS=http://localhost:3000,https://arogya-maa.vercel.app
```

### **Build errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Performance

- ⚡ **Lighthouse Score:** 95+
- 🚀 **First Contentful Paint:** < 1.5s
- 📱 **Mobile Responsive:** 100%
- ♿ **Accessibility:** WCAG 2.1 compliant
- 🌍 **SEO Optimized:** Meta tags, sitemap

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🏆 Achievements

- 🎤 **Voice-enabled** chat in 2 languages
- 🤖 **AI-powered** responses with multiple providers
- 🌍 **Multilingual** support (EN/HI)
- 🚀 **Production-ready** deployment
- ♿ **Accessible** design

---

## 📄 License

Copyright © 2025 ArogyaMaa. All rights reserved.

This project is private and proprietary. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

## 👥 Team

- **Developer:** [Kusum Kumar](https://github.com/KusumKr)
- **Project:** ArogyaMaa - Maternal Wellness Platform
- **Contact:** support@arogyamaa.com

---

## 🙏 Acknowledgments

- **AI Models:** Groq (Llama 3.1), OpenAI (GPT-3.5), Google Gemini
- **UI Components:** shadcn/ui, Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel, Render
- **Inspiration:** Supporting maternal health in India

---

## 📞 Support

- **Website:** https://arogya-maa.vercel.app
- **Email:** support@arogyamaa.com
- **GitHub Issues:** [Report Bug](https://github.com/KusumKr/ArogyaMaa/issues)
- **Documentation:** [Full Docs](https://docs.arogyamaa.com)

---

**Made with ❤️ for Indian mothers**

*Empowering every woman with knowledge and care throughout her motherhood journey.*
