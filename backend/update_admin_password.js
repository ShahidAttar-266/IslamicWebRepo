require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const updatePassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminEmail = 'shahid@gmail.com';
        const newPassword = '123456';
        
        const user = await User.findOne({ email: adminEmail });
        
        if (!user) {
            console.log(`Admin user ${adminEmail} not found.`);
            process.exit(1);
        }
        
        user.password = newPassword;
        await user.save();
        
        console.log(`Password updated successfully for admin: ${adminEmail}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updatePassword();