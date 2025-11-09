import express from 'express';
import { listOrders, getOrder, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', listOrders);
router.get('/:id', getOrder);
router.post('/', createOrder); // create manual
router.put('/:id/status', updateOrderStatus); // adminOnly should be checked in controller or here
// If you want to enforce admin at route level:
// router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
