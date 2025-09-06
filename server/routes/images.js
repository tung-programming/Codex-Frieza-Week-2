import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadImages,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
} from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage to process with sharp
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|avif|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  },
});

// Routes
router.route('/')
  .get(getImages)
  .post(protect, upload.array('images', 10), uploadImages); // Allow up to 10 images

router.route('/:id')
  .get(getImageById)
  .put(protect, updateImage)
  .delete(protect, deleteImage);

export default router;