// src/routes/eventRoutes.js
import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import {
  createEvent,
  updateEvent,
  getEvent,
  getNearbyEvents
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.get('/:id', getEvent);
router.get('/nearby', getNearbyEvents);

export default router;
