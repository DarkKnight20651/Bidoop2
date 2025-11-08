// src/controllers/eventController.js
import Event from '../models/Event.js';
import asyncHandler from 'express-async-handler';

// create event
export const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, coordinates } = req.body;
  const event = new Event({
    name,
    description,
    date,
    coordinates: { type: 'Point', coordinates }
  });
  await event.save();
  res.status(201).json(event);
});

// update event
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Evento no encontrado');
  }
  const { name, description, date, coordinates } = req.body;
  if (name) event.name = name;
  if (description) event.description = description;
  if (date) event.date = date;
  if (coordinates) event.coordinates = { type: 'Point', coordinates };
  await event.save();
  res.json(event);
});

// get event
export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate({
    path: 'comments',
    populate: { path: 'user', select: 'name' }
  });
  if (!event) { res.status(404); throw new Error('Evento no encontrado'); }
  res.json(event);
});

// list upcoming events near location
export const getNearbyEvents = asyncHandler(async (req, res) => {
  const { lng, lat, radius = 10000, limit = 20 } = req.query;
  if (!lng || !lat) {
    res.status(400);
    throw new Error('lng y lat son requeridos');
  }
  const events = await Event.find({
    coordinates: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(radius, 10)
      }
    },
    date: { $gte: new Date() }
  }).limit(parseInt(limit, 10));
  res.json(events);
});
