import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

let conn = null;

async function connectToDatabase() {
  if (conn == null) {
    conn = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  await conn;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await connectToDatabase();
  try {
    const { email, password, fullName, age, sex, location, role, hourlyRate, image, contactNumber } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const user = new User({
      email,
      password,
      fullName,
      age,
      sex,
      location,
      role,
      hourlyRate: role !== 'buyer' ? hourlyRate : 0,
      image,
      contactNumber: contactNumber || ''
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Set cookie (Vercel Edge API: use res.setHeader)
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        image: user.image
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
} 