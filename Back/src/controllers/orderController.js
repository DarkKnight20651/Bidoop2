import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';

// List orders for user (or all for admin)
export const listOrders = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email').populate('address');
    return res.json(orders);
  }
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('address');
  res.json(orders);
});

// Get order by id (owner or admin)
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('address').populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Pedido no encontrado'); }
  if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('No autorizado');
  }
  res.json(order);
});

// Create order manually (rarely used)
export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, items = [], shipping = 0, payment = {}, metadata = {} } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error('items requeridos'); }
  const subTotal = items.reduce((s, it) => s + (it.price * it.quantity), 0);
  const total = subTotal + (shipping || 0);
  const order = await Order.create({
    user: req.user._id,
    address: addressId,
    items,
    subTotal,
    shipping,
    total,
    status: 'pending',
    payment,
    metadata
  });
  res.status(201).json(order);
});

// Update order status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Pedido no encontrado'); }
  if (req.user.role !== 'admin') { res.status(403); throw new Error('Solo admin puede cambiar estado'); }
  order.status = status;
  await order.save();
  res.json(order);
});
