require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin exists
    const existingUser = await User.findOne({ email: 'shahid@gmail.com' });
    if (existingUser) {
      console.log('User with this email already exists.');
      
      // Update to admin if not already
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        // Need to bypass pre-save if we don't want to re-hash password, but we'll just use updateOne
        await User.updateOne({ _id: existingUser._id }, { role: 'admin' });
        console.log('Updated existing user to admin role.');
      }
    } else {
      // Create new admin
      await User.create({
        name: 'Shahid',
        email: 'shahid@gmail.com',
        password: '123',
        role: 'admin',
        isActive: true
      });
      console.log('Admin account created successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();