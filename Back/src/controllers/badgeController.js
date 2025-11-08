// src/controllers/badgeController.js
import Badge from '../models/Badge.js';
import asyncHandler from 'express-async-handler';

// Create badge
export const createBadge = asyncHandler(async (req, res) => {
  const { name, description, icon, category, points } = req.body;
  const badge = new Badge({ name, description, icon, category, points });
  await badge.save();
  res.status(201).json(badge);
});

// List badges
export const listBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.find();
  res.json(badges);
});

// Get badge
export const getBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) { res.status(404); throw new Error('Insignia no encontrada'); }
  res.json(badge);
});
