// src/controllers/rankingController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

/**
 * Rankings:
 * - global: order by points desc
 * - local: filter by nearby users (within radius)
 * - monthly: users who gained most points in the month (we store only total points; for real monthly ranking we'd need a points history collection. Aquí hacemos aproximación usando createdAt of badges if needed.)
 *
 * Para precisión mejor: mantener colección PointsLog para cada ganancia. Aquí implementamos:
 *  - Global: top N by points
 *  - Local: find users near coordinates
 *  - Monthly: aggregate badge grants by createdAt (suponiendo badge push time en users.badges no tiene timestamps) -> alternativa: suponer que User tiene badgeHistory con timestamps. Implementaremos una aproximación usando `updatedAt` of user and points delta is not available. 
 *
 * Recomendación: para producción, crear PointsLog con { userId, points, source, createdAt }.
 */

export const getGlobalRanking = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit || '50', 10);
  const users = await User.find().sort({ points: -1 }).limit(limit).select('name points badges location');
  res.json(users);
});

export const getLocalRanking = asyncHandler(async (req, res) => {
  const { lng, lat, radius = 5000, limit = 50 } = req.query;
  if (!lng || !lat) {
    res.status(400);
    throw new Error('lng y lat son requeridos para ranking local');
  }
  const users = await User.find({
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(radius, 10)
      }
    }
  }).sort({ points: -1 }).limit(parseInt(limit, 10)).select('name points location badges');
  res.json(users);
});

// Monthly ranking using PointsLog collection would be better; here approximation: users created or updated in month
export const getMonthlyRanking = asyncHandler(async (req, res) => {
  const { year, month, limit = 50 } = req.query;
  // If not provided, use current month
  const y = parseInt(year || new Date().getFullYear(), 10);
  const m = parseInt(month || (new Date().getMonth() + 1), 10);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);
  // If PointsLog existed we'd sum points in [start,end)
  // Heurística: users updated in month sorted by points
  const users = await User.find({ updatedAt: { $gte: start, $lt: end } })
    .sort({ points: -1 })
    .limit(parseInt(limit, 10))
    .select('name points badges');
  res.json(users);
});
