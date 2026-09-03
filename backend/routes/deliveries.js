// Delivery routes — Person 3 (Backend/API) builds these out
// This is where "create a delivery", "assign a rider", "update status" logic goes

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const Delivery = require('../models/Delivery');
const User = require('../models/User');

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

// GET all deliveries (with simple filtering)
router.get('/', async (req, res) => {
  try {
    const { status, riderId, retailerId } = req.query;
    const filter = {};
    if (status) filter.currentStatus = status;
    if (riderId && isValidId(riderId)) filter.assignedRider = riderId;
    if (retailerId && isValidId(retailerId)) filter.retailer = retailerId;

    const deliveries = await Delivery.find(filter)
      .populate('retailer', 'name phone role')
      .populate('assignedRider', 'name phone role');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// POST a new delivery request (retailer logs a request)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, address, itemDescription, retailer } =
      req.body;

    if (
      !customerName ||
      !customerPhone ||
      !address ||
      !itemDescription ||
      !retailer
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidId(retailer)) {
      return res.status(400).json({ error: 'Invalid retailer ID format' });
    }

    const qrCodeValue = crypto.randomBytes(8).toString('hex');

    const delivery = new Delivery({
      customerName,
      customerPhone,
      address,
      itemDescription,
      retailer,
      qrCodeValue,
      statusHistory: [{ status: 'Pending', changedBy: retailer }],
    });
    await delivery.save();

    const savedDelivery = await Delivery.findById(delivery._id).populate(
      'retailer',
      'name phone role',
    );

    req.app.get('io').emit('delivery-created', savedDelivery);

    res.status(201).json(savedDelivery);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create delivery' });
  }
});

// PATCH assign a rider to a delivery (dispatcher action)
router.patch('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { riderId, dispatcherId } = req.body;

    if (!isValidId(id) || !isValidId(riderId) || !isValidId(dispatcherId)) {
      return res.status(400).json({ error: 'Invalid ID format provided' });
    }

    const rider = await User.findById(riderId);
    if (!rider || rider.role !== 'rider') {
      return res
        .status(400)
        .json({ error: 'Provided rider ID is invalid or not a rider' });
    }

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (delivery.currentStatus !== 'Pending') {
      return res
        .status(400)
        .json({ error: 'Delivery can only be assigned when Pending' });
    }

    delivery.assignedRider = riderId;
    delivery.currentStatus = 'Assigned';
    delivery.statusHistory.push({
      status: 'Assigned',
      changedBy: dispatcherId,
    });

    await delivery.save();

    const updatedDelivery = await Delivery.findById(delivery._id)
      .populate('retailer', 'name phone role')
      .populate('assignedRider', 'name phone role');

    req.app.get('io').emit('delivery-updated', updatedDelivery);
    res.json(updatedDelivery);
  } catch (err) {
    res.status(400).json({ error: 'Failed to assign rider' });
  }
});

// PATCH update delivery status (rider action: Picked Up / Delivered)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, changedBy, qrCode } = req.body;

    if (!isValidId(id) || !isValidId(changedBy)) {
      return res.status(400).json({ error: 'Invalid ID format provided' });
    }

    if (!['Picked Up', 'Delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status update requested' });
    }

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // Status transition validation
    if (status === 'Picked Up' && delivery.currentStatus !== 'Assigned') {
      return res.status(400).json({
        error: 'Delivery must be Assigned before it can be Picked Up',
      });
    }
    if (status === 'Delivered' && delivery.currentStatus !== 'Picked Up') {
      return res.status(400).json({
        error: 'Delivery must be Picked Up before it can be Delivered',
      });
    }

    // QR confirmation on Delivered
    if (status === 'Delivered' && delivery.qrCodeValue) {
      if (!qrCode || qrCode !== delivery.qrCodeValue) {
        return res.status(400).json({
          error: 'Invalid or missing QR code for delivery confirmation',
        });
      }
    }

    delivery.currentStatus = status;
    delivery.statusHistory.push({ status, changedBy });
    if (status === 'Delivered') {
      delivery.deliveredAt = new Date();
    }

    await delivery.save();

    const updatedDelivery = await Delivery.findById(delivery._id)
      .populate('retailer', 'name phone role')
      .populate('assignedRider', 'name phone role');

    req.app.get('io').emit('delivery-updated', updatedDelivery);
    res.json(updatedDelivery);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update status' });
  }
});

// GET verify delivery by QR code (public — customer confirmation)
router.get('/verify/:qrCode', async (req, res) => {
  try {
    const { qrCode } = req.params;
    if (!qrCode) {
      return res.status(400).json({ error: 'QR code is required' });
    }
    const delivery = await Delivery.findOne({ qrCodeValue: qrCode })
      .populate('retailer', 'name phone role')
      .populate('assignedRider', 'name phone role');

    if (!delivery) {
      return res.status(404).json({ error: 'No delivery found for this QR code' });
    }
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify QR code' });
  }
});

module.exports = router;

