// src/routes/routeRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  autoGenerateRoute,
  saveManualRoute,
  getUserRoutes
} from '../controllers/routeController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/auto', protect, autoGenerateRoute);
router.post('/manual', protect, saveManualRoute);
router.get('/me', protect, getUserRoutes);

export default router;
