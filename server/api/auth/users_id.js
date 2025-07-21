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
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  const { id } = req.query;
  try {
    const { fullName, email, age, sex, location, role, hourlyRate, image, contactNumber, isActive } = req.body;
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (fullName !== undefined) userToUpdate.fullName = fullName;
    if (email !== undefined) userToUpdate.email = email;
    if (age !== undefined) userToUpdate.age = age;
    if (sex !== undefined) userToUpdate.sex = sex;
    if (location !== undefined) userToUpdate.location = location;
    if (role !== undefined) userToUpdate.role = role;
    if (hourlyRate !== undefined) userToUpdate.hourlyRate = hourlyRate;
    if (image !== undefined) userToUpdate.image = image;
    if (contactNumber !== undefined) userToUpdate.contactNumber = contactNumber;
    if (isActive !== undefined) userToUpdate.isActive = isActive;
    await userToUpdate.save();
    res.json(userToUpdate);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
} 