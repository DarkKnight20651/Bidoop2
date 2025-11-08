import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  category: { type: String, enum: ['event', 'place', 'product', 'donation'] },
  points: Number
});

export default mongoose.model('Badge', badgeSchema);
