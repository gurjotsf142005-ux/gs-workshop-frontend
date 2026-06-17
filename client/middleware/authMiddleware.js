const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: e.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ error: 'Admin not found.' });
    if (admin.isLocked()) return res.status(423).json({ error: 'Account locked.' });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication error.' });
  }
};

module.exports = { adminAuth };
