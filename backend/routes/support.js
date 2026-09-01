const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');

// POST /api/support — submit a support request (public, no auth required)
router.post('/', async (req, res) => {
  try {
    const { name, phone, deliveryId, issue } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Your name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'A contact phone number is required.' });
    }
    if (!issue || !issue.trim()) {
      return res.status(400).json({ error: 'Please describe your issue.' });
    }

    const ticket = new SupportTicket({
      name: name.trim(),
      phone: phone.trim(),
      deliveryId: deliveryId ? deliveryId.trim() : '',
      issue: issue.trim()
    });

    await ticket.save();

    res.status(201).json({
      message: 'Support request submitted successfully. Our team will reach out to you shortly.',
      ticketId: ticket._id
    });
  } catch (err) {
    console.error('Support ticket error:', err);
    res.status(500).json({ error: 'Failed to submit support request. Please try again.' });
  }
});

module.exports = router;
