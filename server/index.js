import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import accessoryRoutes from './routes/accessories.js';
import vetRoutes from './routes/vets.js';
import walkerRoutes from './routes/walkers.js';
import daycareRoutes from './routes/daycare.js';
import orderRoutes from './routes/orders.js';
import appointmentRoutes from './routes/appointments.js';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://petpal-3zse.vercel.app'
  ],
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

app.get('/', (req, res) => {
  res.send('API Server is running. Use /api/* endpoints.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 