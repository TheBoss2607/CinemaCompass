// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, 'secretKey');
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.user = { id: user._id, username: user.username };
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const authorizeUser = (req, res, next) => {
  // Add authorization logic here if needed
  // For simplicity, this middleware allows any authenticated user
  next();
};

module.exports = { authenticateUser, authorizeUser };
