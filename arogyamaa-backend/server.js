// server.js - Working version without new features yet
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection (optional for now)
if (process.env.MONGODB_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB Connected Successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('⚠️  Continuing without database...');
    });
} else {
  console.warn('⚠️  MONGODB_URI not set. Running without database.');
}

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

// Import routes
const tipsRoutes = require('./routes/tips');
const feedbackRoutes = require('./routes/feedback');
const chatRoutes = require('./routes/chat');
const chatEnhancedRoutes = require('./routes/chat-enhanced'); // ADD THIS

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 
    ? 'connected' 
    : 'disconnected';
  
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      type: process.env.MONGODB_URI ? 'MongoDB' : 'JSON'
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
    version: '1.0.0' 
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
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

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received');
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

module.exports = app;