const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      role,
      details
    } = req.body;

    if (!name || !phone || !email || !password || !role) {
      return res.status(400).json({ error: 'Please provide all required fields: name, phone, email, password, and role.' });
    }

    const normalizedRole = role.toLowerCase().trim();
    if (!['retailer', 'rider', 'dispatcher', 'admin'].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    // Role-specific validation
    if (normalizedRole === 'retailer') {
      if (!details || !details.shopName || !details.shopLocation || !details.businessType) {
        return res.status(400).json({ error: 'Retailer registration requires: Shop/business name, Shop location, and Business type.' });
      }
    } else if (normalizedRole === 'rider') {
      if (
        !details ||
        !details.address ||
        !details.motorcycleReg ||
        !details.chassisDetails ||
        !details.motorcycleColor ||
        !details.motorcycleModel
      ) {
        return res.status(400).json({
          error: 'Rider registration requires: Address/location, Motorcycle registration number, Chassis/frame details, Motorcycle color, and Motorcycle model.'
        });
      }
    } else if (normalizedRole === 'dispatcher') {
      if (!details || !details.address) {
        return res.status(400).json({ error: 'Dispatcher registration requires: Address/location.' });
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default status is 'pending' for applicants, 'approved' for admin
    const status = normalizedRole === 'admin' ? 'approved' : 'pending';

    const user = new User({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: normalizedRole,
      status: status,
      details: details || {}
    });

    await user.save();

    res.status(201).json({
      message: status === 'pending'
        ? 'Registration submitted successfully. Your account is pending admin approval.'
        : 'Account created successfully.',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        status: user.status,
        details: user.details
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check account status
    if (user.status === 'pending') {
      return res.status(403).json({
        error: 'Your account application is currently pending admin review and approval.',
        status: 'pending',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        }
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        error: 'Your account application has been rejected by an administrator.',
        status: 'rejected',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        }
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        details: user.details
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        status: req.user.status,
        details: req.user.details
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
});

module.exports = router;
