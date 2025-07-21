import mongoose from 'mongoose';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

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

async function getUserFromToken(req) {
  const token = req.cookies?.token || req.headers?.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await connectToDatabase();
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
} 