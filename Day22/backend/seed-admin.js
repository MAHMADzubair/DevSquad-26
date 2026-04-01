import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const email = 'ahmad@gmail.com';
    let admin = await User.findOne({ email });

    if (admin) {
      admin.role = 'superadmin';
      admin.password = '1234';
      await admin.save();
      console.log('✅ Updated existing user to superadmin');
    } else {
      admin = await User.create({
        name: 'Ahmad Admin',
        email,
        password: '1234',
        role: 'superadmin',
      });
      console.log('✅ Created new superadmin account');
    }

    console.log('Email:', email, '| Password: 1234');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
