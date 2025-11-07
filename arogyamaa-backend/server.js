// server.js - Fixed version
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_ORIGINS 
  ? process.env.FRONTEND_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://arogya-maa.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Check AI providers on startup
console.log('\n🤖 Checking AI Providers...');

if (process.env.OPENAI_API_KEY) {
  console.log('✅ OpenAI API Key configured');
} else {
  console.warn('⚠️  OpenAI API Key not set');
}

if (process.env.GROQ_API_KEY) {
  console.log('✅ Groq API Key configured');
} else {
  console.warn('⚠️  Groq API Key not set');
}

if (process.env.GEMINI_API_KEY) {
  console.log('✅ Gemini API Key configured');
} else {
  console.warn('⚠️  Gemini API Key not set');
}

// Check Ollama availability
(async () => {
  try {
    const { isOllamaAvailable } = require('./lib/ollama');
    const ollamaRunning = await isOllamaAvailable();
    
    if (ollamaRunning) {
      console.log('✅ Ollama is running (Local AI)');
    } else {
      console.warn('⚠️  Ollama not running');
    }
  } catch (error) {
    console.warn('⚠️  Ollama module not found (install ollama if needed)');
  }

  // Final check
  const hasAnyProvider = process.env.OPENAI_API_KEY || 
                         process.env.GROQ_API_KEY || 
                         process.env.GEMINI_API_KEY;
  
  if (!hasAnyProvider) {
    console.warn('\n⚠️  WARNING: No AI provider configured!');
    console.warn('   Chat will only use static responses.');
    console.warn('   Get free API keys from:');
    console.warn('   - Groq: https://console.groq.com');
    console.warn('   - Gemini: https://aistudio.google.com/apikey');
  } else {
    console.log('\n✅ AI providers ready!\n');
  }
})();

// Import routes
const tipsRoutes = require('./routes/tips');
const feedbackRoutes = require('./routes/feedback');
const chatRoutes = require('./routes/chat');
const chatEnhancedRoutes = require('./routes/chat-enhanced');

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    features: {
      openai: !!process.env.OPENAI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY
    }
  });
});

// Routes
app.use('/api', tipsRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', chatRoutes);
app.use('/api', chatEnhancedRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'ArogyaMaa API', 
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/chat/session',
      '/api/chat/message',
      '/api/tip-of-day',
      '/api/get-tip'
    ]
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 ArogyaMaa API Server Running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log('=================================');
});

module.exports = app;