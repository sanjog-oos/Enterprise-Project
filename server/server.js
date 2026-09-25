require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const mongoose = require('mongoose');

const authRoutes  = require('./routes/auth');
const gameRoutes  = require('./routes/game');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

const FRONTEND = path.join(__dirname, '..', 'index');
app.use(express.static(FRONTEND));

// ---------- DB CONNECTION (must come BEFORE routes) ----------
const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Middleware to ensure DB is connected before any /api route
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌  MongoDB connection error:', err.message);
    return res.status(500).json({ message: 'Database connection failed' });
  }
});
// -------------------------------------------------------------

app.use('/api/auth',  authRoutes);
app.use('/api/game',  gameRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  module.exports = app;
} else {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log('🚀  Server running at http://localhost:' + PORT);
    });
  });
}