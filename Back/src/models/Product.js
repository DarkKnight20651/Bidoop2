import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

export default mongoose.model('Product', productSchema);
