const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ErrorService = require('../services/errorService');
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     description: Registers a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.get('/validateResetToken', authController.validateResetToken);
router.put('/resetPassword', authController.resetPassword);


router.get('/test-error', async (req, res) => {
    try {
        // Deliberately throw an error
        throw new Error('This is a test error');
    } catch (error) {
        // Log the error
        await ErrorService.logError({
            message: error.message,
            stack: error.stack,
            timestamp: new Date(),
            user: req.user ? req.user.email : 'Guest', // Optional: Get user details if available
            host: req.hostname,
            device: req.headers['user-agent'], // User agent for device info
        });
        
        // Send a response
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});
module.exports = router;
