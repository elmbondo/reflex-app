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

const seedAll = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing from environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB Atlas for full seeding...');

    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('Password123!', salt);
    const adminPassword = await bcrypt.hash('Admin@Reflex2026!', salt);

    // 1. Admin
    let admin = await User.findOne({ email: 'admin@reflex.co.ke' });
    if (!admin) {
      admin = new User({
        name: 'Reflex Admin',
        phone: '+254700000000',
        email: 'admin@reflex.co.ke',
        password: adminPassword,
        role: 'admin',
        status: 'approved',
        details: {}
      });
    } else {
      admin.status = 'approved';
      admin.password = adminPassword;
    }
    await admin.save();

    // 2. Retailer
    let retailer = await User.findOne({ email: 'retailer@reflex.co.ke' });
    if (!retailer) {
      retailer = new User({
        name: 'Wanjiku Kamau (Retailer)',
        phone: '+254712345678',
        email: 'retailer@reflex.co.ke',
        password: commonPassword,
        role: 'retailer',
        status: 'approved',
        details: {
          shopName: 'Wanjiku Boutique',
          shopLocation: 'Biashara Street, Nairobi CBD',
          businessType: 'Fashion & Apparel'
        }
      });
    } else {
      retailer.status = 'approved';
      retailer.password = commonPassword;
    }
    await retailer.save();

    // 3. Dispatcher
    let dispatcher = await User.findOne({ email: 'dispatcher@reflex.co.ke' });
    if (!dispatcher) {
      dispatcher = new User({
        name: 'Otieno James (Dispatcher)',
        phone: '+254722334455',
        email: 'dispatcher@reflex.co.ke',
        password: commonPassword,
        role: 'dispatcher',
        status: 'approved',
        details: {
          hubLocation: 'Central Dispatch Hub - Upper Hill',
          shift: 'Day Shift'
        }
      });
    } else {
      dispatcher.status = 'approved';
      dispatcher.password = commonPassword;
    }
    await dispatcher.save();

    // 4. Rider
    let rider = await User.findOne({ email: 'rider@reflex.co.ke' });
    if (!rider) {
      rider = new User({
        name: 'Kiprono Cheruiyot (Rider)',
        phone: '+254799887766',
        email: 'rider@reflex.co.ke',
        password: commonPassword,
        role: 'rider',
        status: 'approved',
        details: {
          vehicleType: 'Motorbike',
          licensePlate: 'KMD 452X',
          operatingZone: 'Nairobi West & Kilimani'
        }
      });
    } else {
      rider.status = 'approved';
      rider.password = commonPassword;
    }
    await rider.save();

    // 5. Create Sample Deliveries if none exist
    const deliveryCount = await Delivery.countDocuments();
    if (deliveryCount === 0) {
      const qr1 = crypto.randomBytes(8).toString('hex');
      const delivery1 = new Delivery({
        itemDescription: 'High-end Leather Handbags (x3)',
        pickupAddress: 'Wanjiku Boutique, Biashara Street, Nairobi CBD',
        deliveryAddress: 'Greenpark Estate, House 4B, Athi River',
        recipientName: 'Mercy Njeri',
        recipientPhone: '+254711223344',
        deliveryFee: 450,
        currentStatus: 'Assigned',
        createdById: retailer._id,
        assignedRiderId: rider._id,
        qrCodeValue: qr1,
        statusHistory: [
          { status: 'Pending Approval', changedBy: retailer.name, timestamp: new Date() },
          { status: 'Assigned', changedBy: dispatcher.name, timestamp: new Date() }
        ]
      });
      await delivery1.save();

      const qr2 = crypto.randomBytes(8).toString('hex');
      const delivery2 = new Delivery({
        itemDescription: 'Designer Shoes & Accessories Batch',
        pickupAddress: 'Wanjiku Boutique, Biashara Street, Nairobi CBD',
        deliveryAddress: 'Kilimani Heights, Apt 3C, Nairobi',
        recipientName: 'David Ochieng',
        recipientPhone: '+254733445566',
        deliveryFee: 300,
        currentStatus: 'Pending Approval',
        createdById: retailer._id,
        qrCodeValue: qr2,
        statusHistory: [
          { status: 'Pending Approval', changedBy: retailer.name, timestamp: new Date() }
        ]
      });
      await delivery2.save();
      console.log('Sample deliveries created.');
    }

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Registered Test Accounts (Password for all non-admins: Password123!):\n');
    console.log('1. Admin:      admin@reflex.co.ke      (Pass: Admin@Reflex2026!)');
    console.log('2. Retailer:   retailer@reflex.co.ke   (Pass: Password123!)');
    console.log('3. Dispatcher: dispatcher@reflex.co.ke (Pass: Password123!)');
    console.log('4. Rider:      rider@reflex.co.ke      (Pass: Password123!)');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error running seedAll script:', err);
    process.exit(1);
  }
};

seedAll();
