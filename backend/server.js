// Reflex backend — starting point
// Person 3 (Backend/API) builds routes here. Person 5 wires up real-time events.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// --- Database connection ---
// Person 2 sets the real connection string in a .env file (never commit that file)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/reflex')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Basic health check route (confirms server is running) ---
app.get('/', (req, res) => {
  res.send('Reflex API is running');
});

// --- Routes ---
app.use('/api/deliveries', require('./routes/deliveries'));

const User = require('./models/User');

app.get('/api/riders', async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' });
    res.status(200).json(riders);
  } catch (error) {
    console.error("Error fetching riders:", error);
    res.status(500).json({ message: "Server error fetching riders" });
  }
});

// --- Socket.io setup (Person 5 builds on this) ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // fine for development; tighten before real deployment
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
