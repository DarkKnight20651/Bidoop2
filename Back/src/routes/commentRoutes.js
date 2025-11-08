// src/routes/commentRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createComment, deleteComment, upload } from '../controllers/CommentController.js';

const router = express.Router();

// Create with photos: field name 'photos'
router.post('/', protect, upload.array('photos', 6), createComment);
router.delete('/:id', protect, deleteComment);

export default router;
