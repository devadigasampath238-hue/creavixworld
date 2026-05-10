require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/database');

const seed = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@creavixworld.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@Creavix2024!';
  const name = 'CREAVIX Admin';

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('✅ Admin already exists:', email);
      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    console.log('🎉 Admin created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('   ⚠  Change the password after first login!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }

  process.exit(0);
};

seed();
