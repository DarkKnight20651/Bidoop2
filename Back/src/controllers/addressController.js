import asyncHandler from 'express-async-handler';
import Address from '../models/Address.js';

// List addresses of user
export const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json(addresses);
});

// Create address
export const createAddress = asyncHandler(async (req, res) => {
  const { label, recipientName, phone, country, state, city, postalCode, street, number, additional, location, isDefault } = req.body;
  // If isDefault true, unset other defaults
  if (isDefault) {
    await Address.updateMany({ user: req.user._id, isDefault: true }, { $set: { isDefault: false } });
  }
  const address = new Address({
    user: req.user._id,
    label, recipientName, phone, country, state, city, postalCode, street, number, additional,
    location: location ? { type: 'Point', coordinates: location.coordinates } : undefined,
    isDefault: !!isDefault
  });
  await address.save();
  res.status(201).json(address);
});

// Get single address (owner)
export const getAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (!address) { res.status(404); throw new Error('Dirección no encontrada'); }
  if (address.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('No autorizado'); }
  res.json(address);
});

// Update address
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (!address) { res.status(404); throw new Error('Dirección no encontrada'); }
  if (address.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('No autorizado'); }

  const { label, recipientName, phone, country, state, city, postalCode, street, number, additional, location, isDefault } = req.body;
  if (isDefault) {
    await Address.updateMany({ user: req.user._id, isDefault: true }, { $set: { isDefault: false } });
  }
  address.label = label ?? address.label;
  address.recipientName = recipientName ?? address.recipientName;
  address.phone = phone ?? address.phone;
  address.country = country ?? address.country;
  address.state = state ?? address.state;
  address.city = city ?? address.city;
  address.postalCode = postalCode ?? address.postalCode;
  address.street = street ?? address.street;
  address.number = number ?? address.number;
  address.additional = additional ?? address.additional;
  if (location) address.location = { type: 'Point', coordinates: location.coordinates };
  address.isDefault = typeof isDefault === 'boolean' ? isDefault : address.isDefault;

  await address.save();
  res.json(address);
});

// Delete address
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (!address) { res.status(404); throw new Error('Dirección no encontrada'); }
  if (address.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('No autorizado'); }
  await address.deleteOne();
  res.json({ message: 'Dirección eliminada' });
});
