const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const accessoryRoutes = require('./routes/accessories');
const vetRoutes = require('./routes/vets');
const walkerRoutes = require('./routes/walkers');
const daycareRoutes = require('./routes/daycare');
const orderRoutes = require('./routes/orders');
const appointmentRoutes = require('./routes/appointments');

const app = express();
//hello
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/walkers', walkerRoutes);
app.use('/api/daycare', daycareRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 