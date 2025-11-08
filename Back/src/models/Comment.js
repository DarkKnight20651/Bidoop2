import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  photos: [String],
  rating: { type: Number, min: 1, max: 5 },
  targetType: { type: String, enum: ['place', 'event', 'product', 'donation'] },
  targetId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
