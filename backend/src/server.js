const path = require('path');
// Load .env for local dev only — Vercel injects env vars directly
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// Serverless-safe DB connection: reuse existing connection on warm invocations
// without this, each Vercel warm re-use opens a new connection and can exhaust the pool
let dbConnected = false;
const connectOnce = async () => {
    if (!dbConnected && mongoose.connection.readyState === 0) {
        await connectDB();
        dbConnected = true;
    }
};
connectOnce();

// Only start the server if we're not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Global rejection handling
    process.on('unhandledRejection', (err) => {
        console.error(`Unhandled Rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });

    // Handle termination signals
    process.on('SIGTERM', () => {
        server.close(() => {
            console.log('Process terminated');
        });
    });
}

// Export the app for Vercel
module.exports = app;
