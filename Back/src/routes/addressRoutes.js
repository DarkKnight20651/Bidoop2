import express from 'express';
import {
  listAddresses,
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', listAddresses);
router.post('/', createAddress);
router.get('/:id', getAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
