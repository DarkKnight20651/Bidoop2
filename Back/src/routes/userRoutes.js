// src/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  authUser,
  getProfile,
  assignBadgeToUser
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getProfile);

// admin or internal assignment
router.post('/assign-badge', protect, adminOnly, assignBadgeToUser);

export default router;
