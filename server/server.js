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

const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀  Server running!');
      console.log(`👉  Open in browser: http://localhost:${PORT}`);
      console.log('');
    });
  })
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });