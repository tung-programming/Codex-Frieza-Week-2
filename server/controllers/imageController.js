import db from '../config/db.js';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import exifParser from 'exif-parser';

const UPLOADS_DIR = path.resolve('server/uploads');
const THUMBNAILS_DIR = path.resolve('server/uploads/thumbnails');

// Ensure upload directories exist
const ensureDirectories = async () => {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
};
ensureDirectories();

// @desc    Upload one or more images
// @route   POST /api/images
// @access  Private
export const uploadImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    try {
        const uploadedImages = [];
        for (const file of req.files) {
            const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
            const storagePath = path.join(UPLOADS_DIR, uniqueFilename);
            const thumbnailPath = path.join(THUMBNAILS_DIR, uniqueFilename);

            // Process image with Sharp
            const imageProcessor = sharp(file.buffer);
            const metadata = await imageProcessor.metadata();
            
            // Save original image
            await imageProcessor.toFile(storagePath);
            
            // Create and save thumbnail
            await imageProcessor.resize(300, 300, { fit: 'inside' }).toFile(thumbnailPath);

            // Extract EXIF data
            let exifData = null;
            try {
                const parser = exifParser.create(file.buffer);
                exifData = parser.parse();
            } catch (exifError) {
                console.warn('Could not parse EXIF data for', file.originalname);
            }

            const newImage = {
                title: req.body.title || path.parse(file.originalname).name,
                filename: uniqueFilename,
                storage_path: `/uploads/${uniqueFilename}`,
                thumbnail_path: `/uploads/thumbnails/${uniqueFilename}`,
                mime_type: file.mimetype,
                width: metadata.width,
                height: metadata.height,
                size_bytes: file.size,
                uploaded_by_id: req.user.id,
                exif_data: exifData,
                // Optional fields from form
                caption: req.body.caption || '',
                alt_text: req.body.alt_text || '',
                privacy: req.body.privacy || 'public',
                license: req.body.license || '',
            };

            const query = `
                INSERT INTO images (title, filename, storage_path, thumbnail_path, mime_type, width, height, size_bytes, uploaded_by_id, exif_data, caption, alt_text, privacy, license)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING *;
            `;
            const values = Object.values(newImage);
            const { rows } = await db.query(query, values);
            uploadedImages.push(rows[0]);
        }
        res.status(201).json(uploadedImages);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
};

// @desc    Get all public images
// @route   GET /api/images
// @access  Public
export const getImages = async (req, res) => {
    try {
        const query = "SELECT id, title, thumbnail_path, alt_text, width, height FROM images WHERE privacy = 'public' ORDER BY uploaded_at DESC";
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single image by ID
// @route   GET /api/images/:id
// @access  Public (with privacy checks)
export const getImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM images WHERE id = $1';
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        const image = rows[0];

        // Privacy check
        if (image.privacy === 'private' && image.uploaded_by_id !== req.user?.id) {
             return res.status(403).json({ message: 'You do not have permission to view this image.' });
        }

        res.json(image);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update image metadata
// @route   PUT /api/images/:id
// @access  Private
export const updateImage = async (req, res) => {
    const { id } = req.params;
    const { title, caption, alt_text, privacy, license } = req.body;

    try {
        const { rows } = await db.query('SELECT uploaded_by_id FROM images WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Image not found' });

        if (rows[0].uploaded_by_id !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to update this image' });
        }

        const query = `
            UPDATE images SET title = $1, caption = $2, alt_text = $3, privacy = $4, license = $5
            WHERE id = $6 RETURNING *
        `;
        const result = await db.query(query, [title, caption, alt_text, privacy, license, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
export const deleteImage = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await db.query('SELECT storage_path, thumbnail_path, uploaded_by_id FROM images WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Image not found' });
        
        const image = rows[0];
        if (image.uploaded_by_id !== req.user.id) {
             return res.status(403).json({ message: 'User not authorized to delete this image' });
        }
        
        // Delete files from filesystem
        const originalFilePath = path.join(UPLOADS_DIR, path.basename(image.storage_path));
        const thumbFilePath = path.join(THUMBNAILS_DIR, path.basename(image.thumbnail_path));
        
        await fs.unlink(originalFilePath).catch(err => console.error("Failed to delete original file:", err));
        await fs.unlink(thumbFilePath).catch(err => console.error("Failed to delete thumbnail file:", err));
        
        // Delete from database
        await db.query('DELETE FROM images WHERE id = $1', [id]);
        
        res.json({ message: 'Image removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};