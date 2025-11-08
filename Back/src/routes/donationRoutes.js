// src/routes/donationRoutes.js
import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import {
  createDonation,
  donateToCause,
  getDonation
} from '../controllers/donationController.js';

const router = express.Router();

router.post('/', protect, adminOnly, createDonation);
router.post('/:donationId/donate', protect, donateToCause); // body: { amount, senderWallet }
router.get('/:id', getDonation);

export default router;
