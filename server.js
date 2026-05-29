const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./models/db');
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});
app.use(csrfProtection);

app.use('/api/auth', authRoutes);
app.use('/', pageRoutes);

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            success: false,
            errors: [{ field: 'general', message: 'Invalid or missing CSRF token.' }]
        });
    }
    res.status(err.status || 500).json({
        success: false,
        errors: [{ field: 'general', message: 'An unexpected error occurred.' }]
    });
});

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`🔐 Secure Auth App is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        process.exit(1);
    }
}
startServer();