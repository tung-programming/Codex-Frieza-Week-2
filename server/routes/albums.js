import express from 'express';
import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  addImageToAlbum,
} from '../controllers/albumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAlbums)
  .post(protect, createAlbum);

router.route('/:id')
  .get(getAlbumById)
  .put(protect, updateAlbum)
  .delete(protect, deleteAlbum);

router.route('/:id/images')
  .post(protect, addImageToAlbum);

export default router;