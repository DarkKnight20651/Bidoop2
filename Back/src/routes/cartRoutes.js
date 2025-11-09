import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkoutCart
} from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/items', addItemToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.post('/clear', clearCart);
router.post('/checkout', checkoutCart);

export default router;
