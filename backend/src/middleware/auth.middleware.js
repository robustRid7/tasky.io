const jwt = require('jsonwebtoken');
const CustomError = require('../common/error');
const { JWT_SECRET } = require("../config/config.variables");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      throw new CustomError(401, 'Access Denied! No Token Provided.');
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {};  
    req.user.userId = decoded?.userId;
    req.user.id = decoded?.id;

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Invalid or Expired Token!' });
  }
};

module.exports = authMiddleware;
