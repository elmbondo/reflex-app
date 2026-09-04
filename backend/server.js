// Reflex backend — starting point
// Person 3 (Backend/API) builds routes here. Person 5 wires up real-time events.

require('dotenv').config();
const dns = require('dns');
try {
  // Use public DNS to ensure reliable MongoDB Atlas SRV query resolution on Windows
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS server configuration warning:', e.message);
}

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection logic
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MongoDB connection error: MONGO_URI environment variable is not defined.');
      return;
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('MongoDB connected successfully to Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Connect immediately on startup
connectDB();

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- Basic health check route (confirms server is running) ---
app.get('/', (req, res) => {
  res.send('Reflex API is running');
});

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/deliveries', require('./routes/deliveries'));
app.use('/api/support', require('./routes/support'));

const User = require('./models/User');

app.get('/api/riders', async (req, res) => {
  try {
    // Only return approved riders for assignment, with fallback to all riders
    const approvedRiders = await User.find({ role: 'rider', status: 'approved' });
    if (approvedRiders && approvedRiders.length > 0) {
      return res.status(200).json(approvedRiders);
    }
    const allRiders = await User.find({ role: 'rider' });
    res.status(200).json(allRiders);
  } catch (error) {
    console.error("Error fetching riders:", error);
    res.status(500).json({ message: "Server error fetching riders" });
  }
});

// --- Socket.io setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible inside route files if needed, e.g. req.app.get('io')
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
