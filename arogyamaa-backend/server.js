// server.js - ArogyaMaa Backend Main Entry
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const tipsRoutes = require('./routes/tips');
const chatRoutes = require('./routes/chat');
const feedbackRoutes = require('./routes/feedback');
app.use('/api', feedbackRoutes);


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

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api', tipsRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ArogyaMaa API', version: '1.0.0' });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
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