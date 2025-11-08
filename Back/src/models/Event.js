import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

eventSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('Event', eventSchema);
