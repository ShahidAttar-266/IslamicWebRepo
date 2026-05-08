const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Route files
const authRoutes = require('./routes/auth.routes');
const namesRoutes = require('./routes/names.routes');
const subscriptionRoutes = require('./routes/subscriptions.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/users.routes');

const errorHandler = require('./middlewares/error');

const app = express();

// Set security headers
app.use(helmet());

// Enable CORS
const allowedOrigins = ['https://noornames1.netlify.app','https://islamic-web-repo.vercel.app'];

// Always allow localhost in development/fallback
const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'https://islamic-web-repo.vercel.app', 'https://noornames1.netlify.app'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, server-to-server)
        if (!origin) return callback(null, true);

        const sanitizedOrigin = origin.replace(/\/$/, '');
        
        if (
            allowedOrigins.includes(sanitizedOrigin) || 
            defaultOrigins.includes(sanitizedOrigin) ||
            process.env.NODE_ENV === 'development'
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: process.env.NODE_ENV === 'development' ? 10000 : 100, // much higher limit for dev
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later.'
        });
    }
});
app.use(limiter);

// Body parser
// Note: Webhook MUST come before express.json() if it needs raw body
app.use('/api/v1/subscriptions/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Prevent http param pollution
app.use(hpp());

// Request logging middleware
if (process.env.LOG_REQUESTS === 'true') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/names', namesRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);

// Basic route for health check
app.get('/', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Welcome to NoorNames API',
        docs: 'Please use /api/v1/names for data'
    });
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
