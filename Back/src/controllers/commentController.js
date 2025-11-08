// src/controllers/commentController.js
import Comment from '../models/Comment.js';
import Place from '../models/Place.js';
import Product from '../models/Product.js';
import Event from '../models/Event.js';
import Donation from '../models/Donation.js';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Multer storage
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

export const upload = multer({ storage });

// Create comment with optional photos (req.files)
export const createComment = asyncHandler(async (req, res) => {
  const { text, rating, targetType, targetId } = req.body;
  if (!['place', 'product', 'event', 'donation'].includes(targetType)) {
    res.status(400);
    throw new Error('targetType inválido');
  }
  const files = (req.files || []).map(f => `/uploads/${f.filename}`);
  const comment = new Comment({
    user: req.user._id,
    text,
    photos: files,
    rating: rating ? parseInt(rating, 10) : undefined,
    targetType,
    targetId
  });
  await comment.save();

  // attach comment ref to target model
  let target;
  switch (targetType) {
    case 'place': target = await Place.findById(targetId); break;
    case 'product': target = await Product.findById(targetId); break;
    case 'event': target = await Event.findById(targetId); break;
    case 'donation': target = await Donation.findById(targetId); break;
  }
  if (target) {
    target.comments = target.comments || [];
    target.comments.push(comment._id);
    await target.save();
  }
  res.status(201).json(comment);
});

// Delete comment (owner or admin)
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comentario no encontrado');
  }
  const isOwner = req.user._id.toString() === comment.user.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('No autorizado para eliminar el comentario');
  }
  // remove from target
  const { targetType, targetId } = comment;
  let targetModel;
  switch (targetType) {
    case 'place': targetModel = Place; break;
    case 'product': targetModel = Product; break;
    case 'event': targetModel = Event; break;
    case 'donation': targetModel = Donation; break;
  }
  if (targetModel && targetId) {
    const t = await targetModel.findById(targetId);
    if (t) {
      t.comments = (t.comments || []).filter(c => c.toString() !== comment._id.toString());
      await t.save();
    }
  }
  await comment.remove();
  res.json({ message: 'Comentario eliminado' });
});
