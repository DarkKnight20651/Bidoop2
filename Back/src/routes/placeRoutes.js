// src/routes/placeRoutes.js
import express from 'express';
import {
  createPlace,
  updatePlace,
  getPlace,
  deletePlace,
  getNearbyPlaces,
  addProductToPlace
} from '../controllers/placeController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, createPlace);
router.put('/:id', protect, adminOnly, updatePlace);
router.get('/:id', getPlace);
router.delete('/:id', protect, adminOnly, deletePlace);
router.get('/nearby', getNearbyPlaces); // /api/places/nearby?lng=-?&lat=?&radius=5000
router.post('/add-product', protect, adminOnly, addProductToPlace);

export default router;
