import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: Number,
  subtotal: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  items: [orderItemSchema],
  subTotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    provider: { type: String }, // 'openpayments'
    paymentId: String,
    status: String,
    raw: mongoose.Schema.Types.Mixed
  },
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
