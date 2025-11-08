import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  cause: String,
  goal: Number,
  collected: { type: Number, default: 0 },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

donationSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('Donation', donationSchema);
