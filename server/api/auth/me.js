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
  if (!user) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
  res.json({
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      age: user.age,
      sex: user.sex,
      location: user.location,
      hourlyRate: user.hourlyRate,
      image: user.image
    }
  });
} 