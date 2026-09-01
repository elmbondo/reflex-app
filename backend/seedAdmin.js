require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS config warning
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing from environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB for admin seeding.');

    const adminEmail = 'admin@reflex.co.ke';
    let admin = await User.findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@Reflex2026!', salt);

    if (admin) {
      admin.name = 'Reflex Administrator';
      admin.role = 'admin';
      admin.status = 'approved';
      admin.password = hashedPassword;
      await admin.save();
      console.log('Existing admin account updated successfully.');
    } else {
      admin = new User({
        name: 'Reflex Administrator',
        phone: '+254700000000',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'approved',
        details: {}
      });
      await admin.save();
      console.log('New admin account created successfully.');
    }

    await mongoose.disconnect();
    console.log('Admin seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin account:', err);
    process.exit(1);
  }
};

seedAdmin();
