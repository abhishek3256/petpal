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
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await connectToDatabase();
  const user = await getUserFromToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
  try {
    const { fullName, email, age, sex, location, hourlyRate, image, contactNumber } = req.body;
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age;
    if (sex !== undefined) user.sex = sex;
    if (location !== undefined) user.location = location;
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
    if (image !== undefined) user.image = image;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
} 