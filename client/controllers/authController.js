const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ error: 'Registration is closed.' });

    const admin = await Admin.create(req.body);
    const token = signToken(admin._id);
    res.status(201).json({ token, admin });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already registered.' });
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) return res.status(401).json({ error: 'Invalid email or password.' });

    if (admin.isLocked()) return res.status(423).json({ error: 'Account temporarily locked.' });

    const ok = await admin.comparePassword(password);
    if (!ok) {
      await admin.incrementLoginAttempts();
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Reset attempts on success
    await admin.updateOne({ $set: { loginAttempts: 0, lastLogin: new Date() }, $unset: { lockUntil: 1 } });
    const token = signToken(admin._id);
    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

exports.getMe = async (req, res) => {
  res.json({ admin: req.admin });
};
