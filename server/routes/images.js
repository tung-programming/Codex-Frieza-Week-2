import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadImages,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
  getImageStats,
} from '../controllers/imageController.js';
import { protect, optionalAuth, editorOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|avif|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File upload only supports: JPEG, PNG, WEBP, AVIF, GIF'));
  },
});

// Routes
router.route('/')
  .get(optionalAuth, getImages)
  .post(protect, editorOrAdmin, upload.array('images', 10), uploadImages);

router.get('/stats', optionalAuth, getImageStats);

router.route('/:id')
  .get(optionalAuth, getImageById)
  .put(protect, updateImage)
  .delete(protect, deleteImage);

export default router;