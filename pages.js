/**
 * Page Routes
 * 
 * Serves HTML pages and provides CSRF tokens to the frontend.
 * Pages are served from the /views directory.
 */

const express = require('express');
const router = express.Router();
const path = require('path');

// ─── Page Routes ─────────────────────────────────────────────────────────────

/**
 * GET /
 * Redirect root to the login page.
 */
router.get('/', (req, res) => {
    res.redirect('/login');
});

/**
 * GET /signup
 * Serve the sign-up page.
 */
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
});

/**
 * GET /login
 * Serve the login page.
 */
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

/**
 * GET /dashboard
 * Serve the dashboard page.
 * Note: Authentication is verified client-side via the /api/auth/me endpoint.
 * The page will redirect to login if the user is not authenticated.
 */
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});

/**
 * GET /api/csrf-token
 * Provide a CSRF token to the frontend.
 * The frontend includes this token in form submissions
 * to prevent Cross-Site Request Forgery attacks.
 */
router.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;
