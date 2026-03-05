require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust the reverse proxy (e.g. Render/Vercel) for rate limiting
app.set('trust proxy', 1);

// Security Headers (Helmet)
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Prevent XSS attacks (xss-clean removed due to incompatibility with Express 5)

// Prevent http param pollution
app.use(hpp());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { msg: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Art Supplies API is running!' });
});

// Centralized Error Handling Middleware must be registered AFTER all routes
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const initDB = require('./config/init');

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    await initDB();
});
