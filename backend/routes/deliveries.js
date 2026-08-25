// Delivery routes — Person 3 (Backend/API) builds these out
// This is where "create a delivery", "assign a rider", "update status" logic goes

const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

// GET all deliveries (dispatcher's open queue)
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('retailer assignedRider');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new delivery request (retailer logs a request)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, address, itemDescription, retailer } = req.body;
    const delivery = new Delivery({
      customerName,
      customerPhone,
      address,
      itemDescription,
      retailer,
      statusHistory: [{ status: 'Pending', changedBy: retailer }]
    });
    await delivery.save();

    // Notify connected clients in real time (Person 5 will expand this)
    req.app.get('io').emit('delivery-created', delivery);

    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH assign a rider to a delivery (dispatcher action)
router.patch('/:id/assign', async (req, res) => {
  try {
    const { riderId, dispatcherId } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      {
        assignedRider: riderId,
        currentStatus: 'Assigned',
        $push: { statusHistory: { status: 'Assigned', changedBy: dispatcherId } }
      },
      { new: true }
    );

    req.app.get('io').emit('delivery-updated', delivery);
    res.json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update delivery status (rider action: Picked Up / Delivered)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, changedBy } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      {
        currentStatus: status,
        $push: { statusHistory: { status, changedBy } },
        ...(status === 'Delivered' ? { deliveredAt: new Date() } : {})
      },
      { new: true }
    );

    req.app.get('io').emit('delivery-updated', delivery);
    res.json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
