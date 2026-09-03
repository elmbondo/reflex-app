require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS config warning
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('./models/User');
const Delivery = require('./models/Delivery');

const seedTestAccounts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing from environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB Atlas...');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Password123!', salt);

    // 1. testretailer
    let retailer = await User.findOne({ email: 'testretailer@reflex.co.ke' });
    if (!retailer) {
      retailer = new User({
        name: 'testretailer',
        phone: '0711111111',
        email: 'testretailer@reflex.co.ke',
        password: password,
        role: 'retailer',
        status: 'approved',
        details: {
          shopName: 'Test Retail Shop',
          shopLocation: 'Moi Avenue, Nairobi CBD',
          businessType: 'Retail & Fashion'
        }
      });
    } else {
      retailer.name = 'testretailer';
      retailer.status = 'approved';
      retailer.password = password;
    }
    await retailer.save();
    console.log('✅ testretailer seeded successfully.');

    // 2. testrider
    let rider = await User.findOne({ email: 'testrider@reflex.co.ke' });
    if (!rider) {
      rider = new User({
        name: 'testrider',
        phone: '0722222222',
        email: 'testrider@reflex.co.ke',
        password: password,
        role: 'rider',
        status: 'approved',
        details: {
          vehicleType: 'Motorbike',
          licensePlate: 'KMDF 123X',
          operatingZone: 'Nairobi CBD & Westlands'
        }
      });
    } else {
      rider.name = 'testrider';
      rider.status = 'approved';
      rider.password = password;
    }
    await rider.save();
    console.log('✅ testrider seeded successfully.');

    // 3. testdispatcher
    let dispatcher = await User.findOne({ email: 'testdispatcher@reflex.co.ke' });
    if (!dispatcher) {
      dispatcher = new User({
        name: 'testdispatcher',
        phone: '0733333333',
        email: 'testdispatcher@reflex.co.ke',
        password: password,
        role: 'dispatcher',
        status: 'approved',
        details: {
          hubLocation: 'Central Nairobi Logistics Hub',
          shift: 'Day Shift'
        }
      });
    } else {
      dispatcher.name = 'testdispatcher';
      dispatcher.status = 'approved';
      dispatcher.password = password;
    }
    await dispatcher.save();
    console.log('✅ testdispatcher seeded successfully.');

    // Create a sample package delivery for testing
    const qrCodeValue = crypto.randomBytes(8).toString('hex');
    const sampleDelivery = new Delivery({
      customerName: 'Amina Mohamed',
      customerPhone: '0744444444',
      address: 'Westlands Square, 3rd Floor, Nairobi',
      itemDescription: 'Test Electronics Package',
      retailer: retailer._id,
      currentStatus: 'Pending',
      qrCodeValue: qrCodeValue,
      statusHistory: [
        { status: 'Pending', changedBy: retailer._id, timestamp: new Date() }
      ]
    });
    await sampleDelivery.save();
    console.log('✅ Sample test delivery created with QR code:', qrCodeValue);

    await mongoose.disconnect();
    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Password for all test accounts: Password123!\n');
    console.log('1. Retailer:   testretailer@reflex.co.ke');
    console.log('2. Rider:      testrider@reflex.co.ke');
    console.log('3. Dispatcher: testdispatcher@reflex.co.ke');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding test accounts:', err);
    process.exit(1);
  }
};

seedTestAccounts();
