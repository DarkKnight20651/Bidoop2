// src/controllers/donationController.js
import Donation from '../models/Donation.js';
import asyncHandler from 'express-async-handler';
import { makePayment } from '../services/interledgerService.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';

// Create a donation cause
export const createDonation = asyncHandler(async (req, res) => {
  const { cause, goal, coordinates } = req.body;
  const d = new Donation({
    cause,
    goal,
    coordinates: { type: 'Point', coordinates }
  });
  await d.save();
  res.status(201).json(d);
});

// Donate (uses OpenPayments)
export const donateToCause = asyncHandler(async (req, res) => {
  const { donationId } = req.params;
  const { amount, senderWallet } = req.body;

  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error('Causa no encontrada');
  }

  // For safety, receiverWallet could be tied to the donation or an app account
  const receiverWallet = process.env.PLATFORM_WALLET || process.env.OPENPAYMENTS_RECEIVER_WALLET;
  if (!receiverWallet) {
    res.status(500);
    throw new Error('Wallet receptor no configurado');
  }

  // Execute payment via interledger service
  const paymentRes = await makePayment({
    senderWallet,
    receiverWallet,
    amount,
    metadata: { donationId, donor: req.user._id.toString() }
  });

  // Update collected amount
  donation.collected = (donation.collected || 0) + Number(amount);
  await donation.save();

  // Give donor a donation badge if exists
  const donationBadge = await Badge.findOne({ category: 'donation' });
  if (donationBadge) {
    const user = await User.findById(req.user._id);
    if (!user.badges.includes(donationBadge._id)) {
      user.badges.push(donationBadge._id);
      user.points = (user.points || 0) + (donationBadge.points || 0);
      await user.save();
    }
  }

  res.json({
    message: 'Donación registrada',
    payment: paymentRes,
    donation
  });
});

// Get donation by id
export const getDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id)
    .populate({ path: 'comments', populate: { path: 'user', select: 'name' } });
  if (!donation) { res.status(404); throw new Error('Causa no encontrada'); }
  res.json(donation);
});
