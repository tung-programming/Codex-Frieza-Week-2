import express from 'express';
import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} from '../controllers/albumController.js';
import { protect, optionalAuth, editorOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.route('/')
  .get(optionalAuth, getAlbums)
  .post(protect, editorOrAdmin, createAlbum);

router.route('/:id')
  .get(optionalAuth, getAlbumById)
  .put(protect, updateAlbum)
  .delete(protect, deleteAlbum);

export default router;