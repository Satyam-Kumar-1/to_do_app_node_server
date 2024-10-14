const userRepository = require('../dataAccess/userRepository');
const { encrypt } = require('../utils/cryptoUtils')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const mailService = require('../utils/mailService')
const crypto = require('crypto');
const ErrorService = require('./errorService');
const { ClientError, CriticalError } = require('../errors/customError');
const { getIPV4Adress } = require('../utils/getIpAddress');
const { handleError } = require('../errors/errorHandler');

exports.signup = async (req, name, email, password) => {
  try {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ClientError('User already exists', 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const currDate = new Date();
    const user = await userRepository.createUser({ name, email, password: hashedPassword, createdat: currDate, updatedat: currDate });
    return user;
  } catch (error) {
    await handleError(req, error)
  }
};

exports.login = async (req, email, password) => {
  try {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ClientError('User not found', 400);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ClientError('Invalid credentials', 400);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '8h' });
    const encrypted_token = encrypt(token);
    return { token: encrypted_token, name: user.name, id: user.id };
  } catch (error) {
    await handleError(req, error)
  }
};
exports.forgotPassword = async (req, email) => {
  try {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ClientError('User not found', 400);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 30 * 60 * 1000;
    await userRepository.saveResetToken(user.id, resetToken, tokenExpiry);
    const resetLink = `http://localhost:3000/user/auth/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: '"Satyam Kumar" <sk8702320@gmail.com>',
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}`,
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              max-width: 600px;
              
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
          
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #333;
            }
            .content {
              font-size: 16px;
              color: #555;
            }
            .footer {
              
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
            .btn {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              font-size: 16px;
              color: #fff !important;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
            }
            .btn:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>Hi <b>${user.name || 'there'}</b>,</p>
              <p>You requested a password reset. Please use the following link to reset your password:</p>
              <a href="${resetLink}" class="btn">Reset Password</a>
              <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Thank you,</p>
              <p>To do Application Team</p>
            </div>
          </div>
        </body>
      </html>
    `
    };

    // Send email
    await mailService.sendEmail(mailOptions);
  } catch (error) {
    await handleError(req, error)
  }

};

exports.validateResetToken = async (req, token) => {
  try {
    const resetToken = await userRepository.findResetToken(token);
    if (!resetToken || resetToken.expiry < Date.now()) {
      return false;
    }
    return true;
  } catch (error) {
    await handleError(req, error)
  }
};

exports.resetPassword = async (req, token, newPassword) => {
  try {
    const resetToken = await userRepository.findResetToken(token);
    if (!resetToken || resetToken.token_expiry < Date.now()) {
      throw new ClientError('Invalid or expired token', 400);
    }

    // Update the user's password (hash it first)
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await userRepository.updatePassword(resetToken.id, hashedPassword);

    // Invalidate the token
    await userRepository.invalidateResetToken(token);
  } catch (error) {
    await handleError(req, error)
  }
};
