import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String },     // snapshot: name at time of add
  price: { type: Number },    // snapshot price
  quantity: { type: Number, default: 1 },
  subtotal: { type: Number }  // price * quantity (cached)
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [cartItemSchema],
  total: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// helper to recalc totals
cartSchema.methods.recalculate = function () {
  let total = 0;
  this.items.forEach(it => {
    it.subtotal = (it.price || 0) * (it.quantity || 0);
    total += it.subtotal;
  });
  this.total = total;
  this.updatedAt = new Date();
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
