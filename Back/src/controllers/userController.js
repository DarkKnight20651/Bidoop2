// src/controllers/userController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../utils/generateToken.js';
import Badge from '../models/Badge.js';

// Register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Usuario ya registrado');
  }
  const user = new User({ name, email, password, location });
  await user.save();
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
});

// Login
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      badges: user.badges,
      points: user.points,
      token: generateToken(user._id)
    });
  }
  res.status(401);
  throw new Error('Credenciales inválidas');
});

// Get profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('badges');
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  res.json(user);
});

// Assign badge to user (internal use)
export const assignBadgeToUser = asyncHandler(async (req, res) => {
  const { userId, badgeId } = req.body;
  const user = await User.findById(userId);
  const badge = await Badge.findById(badgeId);
  if (!user || !badge) {
    res.status(404);
    throw new Error('Usuario o insignia no encontrados');
  }
  // avoid duplicate
  if (!user.badges.includes(badge._id)) {
    user.badges.push(badge._id);
    user.points = (user.points || 0) + (badge.points || 0);
    await user.save();
  }
  res.json({ message: 'Insignia asignada', user });
});
