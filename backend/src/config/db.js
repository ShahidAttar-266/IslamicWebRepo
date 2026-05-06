const mongoose = require('mongoose');

const connectDB = async () => {
    const connOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Force IPv4 to avoid DNS resolution issues on some systems
    };

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, connOptions);
        console.log(`MongoDB Connected (Standard): ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        console.error(`MongoDB Runtime Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Disconnected. Attempting to reconnect...');
    });
};

module.exports = connectDB;