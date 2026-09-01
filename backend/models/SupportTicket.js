const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  deliveryId: {
    type: String,
    trim: true,
    default: ''
  },
  issue: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
