/**
 * seed.js — Creates default admin account in the database.
 * Run once: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  const adminEmail = 'admin@cyberawareness.local';
  const existing   = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log('ℹ️   Admin account already exists:', adminEmail);
  } else {
    await User.create({
      name:     'Admin User',
      email:    adminEmail,
      password: 'admin123',
      role:     'admin'
    });
    console.log('🌱  Admin account created!');
    console.log('    Email:    ', adminEmail);
    console.log('    Password:  admin123');
    console.log('    ⚠️  Change this password in production!');
  }

  await mongoose.disconnect();
  console.log('✅  Done.');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
