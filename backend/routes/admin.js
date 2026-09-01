const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes in this file require Admin role
router.use(verifyToken, requireRole('admin'));

// GET /api/admin/applications - view pending and historical applications
router.get('/applications', async (req, res) => {
  try {
    const { status, role } = req.query;
    const filter = {};

    if (status) {
      filter.status = status.toLowerCase();
    }
    if (role) {
      filter.role = role.toLowerCase();
    }

    const applications = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Failed to fetch user applications.' });
  }
});

// PATCH /api/admin/applications/:id/approve - approve applicant
router.patch('/applications/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Applicant not found.' });
    }

    user.status = 'approved';
    if (role && ['retailer', 'rider', 'dispatcher', 'admin'].includes(role.toLowerCase())) {
      user.role = role.toLowerCase();
    }

    await user.save();

    res.json({
      message: `User ${user.name} has been approved as ${user.role}.`,
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
    console.error('Error approving user:', err);
    res.status(500).json({ error: 'Failed to approve applicant.' });
  }
});

// PATCH /api/admin/applications/:id/reject - reject applicant
router.patch('/applications/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Applicant not found.' });
    }

    user.status = 'rejected';
    await user.save();

    res.json({
      message: `User ${user.name} application has been rejected.`,
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
    console.error('Error rejecting user:', err);
    res.status(500).json({ error: 'Failed to reject applicant.' });
  }
});

// GET /api/admin/stats - statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingCount = await User.countDocuments({ status: 'pending' });
    const approvedCount = await User.countDocuments({ status: 'approved' });
    const rejectedCount = await User.countDocuments({ status: 'rejected' });
    const retailers = await User.countDocuments({ role: 'retailer', status: 'approved' });
    const riders = await User.countDocuments({ role: 'rider', status: 'approved' });
    const dispatchers = await User.countDocuments({ role: 'dispatcher', status: 'approved' });

    res.json({
      totalUsers,
      pendingCount,
      approvedCount,
      rejectedCount,
      roleCounts: {
        retailers,
        riders,
        dispatchers
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: 'Failed to fetch platform stats.' });
  }
});

module.exports = router;
