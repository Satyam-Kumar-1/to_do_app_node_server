const authService = require('../services/authService');
const { ClientError, CriticalError } = require('../errors/customError');
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.signup(req, name, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An internal error occurred' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(req, email, password);
    res.status(200).json({ message: 'User authenticated successfully', data });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An internal error occurred' });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await authService.forgotPassword(req, email);
    res.status(200).json({ message: 'If the email exists in our system, a reset link has been sent.' });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An internal error occurred' });
  }
};

exports.validateResetToken = async (req, res) => {
  const { token } = req.query;

  try {
    const isValid = await authService.validateResetToken(req, token);
    if (isValid) {
      res.status(200).send({ message: 'Token is valid' });
    } else {
      return res.status(400).send({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An internal error occurred' });
  }
};
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    await authService.resetPassword(req, token, password);
    res.status(200).send({ message: 'Password reset successful' });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An internal error occurred' });
  }
};

