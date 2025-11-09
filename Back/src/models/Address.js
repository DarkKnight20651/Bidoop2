import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, default: 'Casa' }, // Casa, Trabajo, Otro
  recipientName: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, default: 'México' },
  state: String,
  city: String,
  postalCode: String,
  street: { type: String, required: true },
  number: String,
  additional: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

addressSchema.index({ location: '2dsphere' });

const Address = mongoose.model('Address', addressSchema);
export default Address;
