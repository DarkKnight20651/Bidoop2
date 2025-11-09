import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { makePayment } from '../services/interledgerService.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';

/**
 * Helpers
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [], total: 0 });
  }
  return cart;
};

// Get cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate('items.product', 'name price'); // ensure product info if needed
  res.json(cart);
});

// Add item to cart
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) { res.status(400); throw new Error('productId requerido'); }
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Producto no encontrado'); }

  const cart = await getOrCreateCart(req.user._id);

  // find existing item
  const existing = cart.items.find(it => it.product.toString() === productId.toString());
  if (existing) {
    existing.quantity = Math.max(1, existing.quantity + Number(quantity));
    existing.price = product.price;
    existing.name = product.name;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: Number(quantity),
      subtotal: product.price * Number(quantity)
    });
  }

  cart.recalculate();
  await cart.save();
  res.status(201).json(cart);
});

// Update item quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);
  if (!item) { res.status(404); throw new Error('Item no encontrado en carrito'); }
  item.quantity = Math.max(0, Number(quantity));
  if (item.quantity === 0) {
    item.remove();
  }
  cart.recalculate();
  await cart.save();
  res.json(cart);
});

// Remove item by itemId
export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);
  if (!item) { res.status(404); throw new Error('Item no encontrado en carrito'); }
  item.remove();
  cart.recalculate();
  await cart.save();
  res.json(cart);
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  cart.total = 0;
  await cart.save();
  res.json({ message: 'Carrito vaciado' });
});

// Checkout: create order and make payment
export const checkoutCart = asyncHandler(async (req, res) => {
  const { addressId, payment } = req.body; // payment: { senderWallet }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || (cart.items.length === 0)) { res.status(400); throw new Error('Carrito vacío'); }

  // reload product prices as snapshot
  const populatedItems = [];
  for (const it of cart.items) {
    const product = await Product.findById(it.product);
    if (!product) { res.status(400); throw new Error(`Producto no encontrado: ${it.product}`); }
    const price = product.price;
    const quantity = it.quantity;
    populatedItems.push({
      product: product._id,
      name: product.name,
      price,
      quantity,
      subtotal: price * quantity
    });
  }

  const subTotal = populatedItems.reduce((s, i) => s + (i.subtotal || 0), 0);
  const shipping = 0; // calc if you want
  const total = subTotal + shipping;

  // create order
  const order = new Order({
    user: req.user._id,
    address: req.body.addressId,
    items: populatedItems,
    subTotal,
    shipping,
    total,
    status: 'pending',
    payment: {}
  });
  await order.save();

  // Process payment if payment info provided
  if (payment?.senderWallet) {
    try {
      const receiverWallet = process.env.PLATFORM_WALLET || process.env.OPENPAYMENTS_RECEIVER_WALLET;
      if (!receiverWallet) throw new Error('Wallet del receptor no configurado');
      const paymentRes = await makePayment({
        senderWallet: payment.senderWallet,
        receiverWallet,
        amount: total,
        metadata: { orderId: order._id.toString(), userId: req.user._id.toString() }
      });
      order.payment = {
        provider: 'openpayments',
        paymentId: paymentRes.id || paymentRes.paymentId || null,
        status: paymentRes.status || 'unknown',
        raw: paymentRes
      };
      // mark order as paid if payment indicates success (adapt a tu proveedor)
      if (paymentRes.status === 'succeeded' || paymentRes.status === 'paid' || paymentRes.status === 'success') {
        order.status = 'paid';
      } else {
        // keep pending or set processing depending on provider
        order.status = 'processing';
      }
      await order.save();
    } catch (err) {
      // payment failed -> return order with error
      order.payment = { provider: 'openpayments', status: 'failed', raw: { message: err.message } };
      await order.save();
      return res.status(502).json({ message: 'Error en el pago', error: err.message, order });
    }
  }

  // empty cart
  cart.items = [];
  cart.total = 0;
  await cart.save();

  // optional: assign badge for purchase
  const purchaseBadge = await Badge.findOne({ category: 'product' });
  if (purchaseBadge) {
    const user = await User.findById(req.user._id);
    if (!user.badges.includes(purchaseBadge._id)) {
      user.badges.push(purchaseBadge._id);
      user.points = (user.points || 0) + (purchaseBadge.points || 0);
      await user.save();
    }
  }

  res.status(201).json({ message: 'Pedido creado', order });
});
