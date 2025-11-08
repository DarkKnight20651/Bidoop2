// src/routes/rankingRoutes.js
import express from 'express';
import { getGlobalRanking, getLocalRanking, getMonthlyRanking } from '../controllers/rankingController.js';

const router = express.Router();

router.get('/global', getGlobalRanking);
router.get('/local', getLocalRanking);
router.get('/monthly', getMonthlyRanking);

export default router;
