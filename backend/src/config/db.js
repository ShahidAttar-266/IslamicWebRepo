const mongoose = require('mongoose');

const connectDB = async () => {
    const connOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Force IPv4 to avoid DNS resolution issues on some systems
    };

    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in environment variables');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI, connOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Do not process.exit(1) on Vercel as it crashes the function without good logs
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }

    mongoose.connection.on('error', (err) => {
        console.error(`MongoDB Runtime Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Disconnected. Attempting to reconnect...');
    });
};

module.exports = connectDB;