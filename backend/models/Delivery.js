// Delivery model — Person 2 (Architecture/Database) owns this file
// This is where the "data model" from the architecture doc becomes real code

const mongoose = require('mongoose');

// Each status change gets logged here — this is our "proof of delivery" trail
const statusEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Picked Up', 'Delivered'],
    required: true
  },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

const deliverySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  itemDescription: { type: String, required: true },

  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedRider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  currentStatus: {
    type: String,
    enum: ['Pending', 'Assigned', 'Picked Up', 'Delivered'],
    default: 'Pending'
  },
  statusHistory: [statusEventSchema], // full history lives inside the delivery itself

  qrCodeValue: { type: String },
  deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
