// src/routes/badgeRoutes.js
import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import { createBadge, listBadges, getBadge } from '../controllers/BadgeController.js';

const router = express.Router();

router.post('/', protect, adminOnly, createBadge);
router.get('/', listBadges);
router.get('/:id', getBadge);

export default router;
