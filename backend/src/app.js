const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// Route files
const authRoutes = require('./routes/auth.routes');
const namesRoutes = require('./routes/names.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/users.routes');
const bugRoutes = require('./routes/bugs.routes');

const errorHandler = require('./middlewares/error');

const app = express();

// Enable Gzip/Brotli text compression
app.use(compression());

// Set security headers
app.use(helmet());

// Enable CORS
const allowedOrigins = new Set([
    'https://islamic-web-repo.vercel.app',
    'https://islamic-web-repo-jcwb.vercel.app',
    'https://www.islamicnames.in'
]);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, server-to-server)
        if (!origin) return callback(null, true);

        const sanitizedOrigin = origin.replace(/\/$/, '');

        if (allowedOrigins.has(sanitizedOrigin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS`));
        }
},
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.set('trust proxy', 1); // Trust Vercel's proxy layer

// Rate limiting (in-memory store — safe for serverless)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: process.env.NODE_ENV === 'development' ? 10000 : 100,
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
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Islamic Web API Running',
        version: 'v1'
    });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/names', namesRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bugs', bugRoutes);

// Basic route for health check
app.get('/', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Welcome to IslamicNames API',
        docs: 'Please use /api/v1/names for data'
    });
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ ok: true, ts: Date.now() });
});


// Error handling middleware
app.use(errorHandler);

module.exports = app;
