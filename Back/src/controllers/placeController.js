// src/controllers/placeController.js
import Place from '../models/Place.js';
import Comment from '../models/Comment.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// Create place
export const createPlace = asyncHandler(async (req, res) => {
  const { name, description, location, category } = req.body;

  if (!location || !location.coordinates) {
    res.status(400);
    throw new Error("Debes enviar location.coordinates en el body");
  }

  const place = new Place({
    name,
    description,
    location,
    category
  });

  await place.save();
  res.status(201).json(place);
});

// Update place
export const updatePlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error('Lugar no encontrado');
  }
  const { name, description, coordinates, category } = req.body;
  if (name) place.name = name;
  if (description) place.description = description;
  if (coordinates) place.coordinates = { type: 'Point', coordinates };
  if (category) place.category = category;
  await place.save();
  res.json(place);
});

// Get place by id (with products and comments)
export const getPlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id)
    .populate('products')
    .populate({ path: 'comments', populate: { path: 'user', select: 'name' } });
  if (!place) {
    res.status(404);
    throw new Error('Lugar no encontrado');
  }
  res.json(place);
});

// Delete place
export const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error('Lugar no encontrado');
  }
  await Product.deleteMany({ place: place._id });
  await place.remove();
  res.json({ message: 'Lugar eliminado' });
});

// Nearby places search (radius in meters)
export const getNearbyPlaces = asyncHandler(async (req, res) => {
  const { lng, lat, radius = 5000, category, limit = 20 } = req.query;
  if (!lng || !lat) {
    res.status(400);
    throw new Error('lng y lat son requeridos');
  }
  const filter = {
    coordinates: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(radius, 10)
      }
    }
  };
  if (category) filter.category = category;
  const places = await Place.find(filter).limit(parseInt(limit, 10));
  res.json(places);
});

// Add product reference to place (helper)
export const addProductToPlace = asyncHandler(async (req, res) => {
  const { placeId, productId } = req.body;
  const place = await Place.findById(placeId);
  if (!place) {
    res.status(404);
    throw new Error('Lugar no encontrado');
  }
  if (!place.products.includes(productId)) {
    place.products.push(productId);
    await place.save();
  }
  res.json(place);
});
