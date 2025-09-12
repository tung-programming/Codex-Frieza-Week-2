import db from '../config/db.js';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import exifParser from 'exif-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const THUMBNAILS_DIR = path.resolve(__dirname, '../uploads/thumbnails');

// Ensure upload directories exist
const ensureDirectories = async () => {
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
        console.log('Upload directories ensured');
    } catch (error) {
        console.error('Error creating directories:', error);
    }
};
ensureDirectories();

// @desc    Upload one or more images
// @route   POST /api/images
// @access  Private
export const uploadImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'No files were uploaded.' 
        });
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
            
            // Create and save thumbnail (300x300, maintain aspect ratio)
            await imageProcessor
                .resize(300, 300, { 
                    fit: 'inside',
                    withoutEnlargement: true 
                })
                .toFile(thumbnailPath);

            // Extract EXIF data
            let exifData = null;
            try {
                if (file.buffer.length > 16) { // Minimum size for EXIF
                    const parser = exifParser.create(file.buffer);
                    exifData = parser.parse();
                }
            } catch (exifError) {
                console.warn('Could not parse EXIF data for', file.originalname);
            }

            // Insert image record into database
            const insertQuery = `
                INSERT INTO images (
                    title, filename, storage_path, thumbnail_path, mime_type, 
                    width, height, size_bytes, uploaded_by, exif_data, 
                    caption, alt_text, privacy, license, album_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                RETURNING *
            `;

            const values = [
                req.body.title || path.parse(file.originalname).name,
                uniqueFilename,
                `/uploads/${uniqueFilename}`,
                `/uploads/thumbnails/${uniqueFilename}`,
                file.mimetype,
                metadata.width,
                metadata.height,
                file.size,
                req.user.id,
                exifData ? JSON.stringify(exifData) : null,
                req.body.caption || '',
                req.body.alt_text || '',
                req.body.privacy || 'public',
                req.body.license || '',
                req.body.album_id || null
            ];

            const { rows } = await db.query(insertQuery, values);
            uploadedImages.push(rows[0]);
        }

        res.status(201).json({
            success: true,
            message: `${uploadedImages.length} image(s) uploaded successfully`,
            images: uploadedImages
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during file upload' 
        });
    }
};

// @desc    Get images with search and filters
// @route   GET /api/images
// @access  Public
export const getImages = async (req, res) => {
    try {
        const { 
            search, 
            album_id, 
            privacy, 
            uploaded_by,
            limit = 50, 
            offset = 0,
            sort_by = 'uploaded_at',
            sort_order = 'DESC'
        } = req.query;

        let query = `
            SELECT 
                i.id, i.title, i.caption, i.alt_text, i.thumbnail_path, 
                i.storage_path, i.width, i.height, i.privacy, i.view_count,
                i.uploaded_at, i.size_bytes, i.license,
                u.username as uploaded_by_name,
                a.name as album_name
            FROM images i
            LEFT JOIN users u ON i.uploaded_by = u.id
            LEFT JOIN albums a ON i.album_id = a.id
            WHERE 1=1
        `;

        const queryParams = [];
        let paramIndex = 1;

        // Privacy filter - only show public images unless user is authenticated
        if (!req.user) {
            query += ` AND i.privacy = 'public'`;
        } else if (privacy) {
            query += ` AND i.privacy = $${paramIndex}`;
            queryParams.push(privacy);
            paramIndex++;
        }

        // Search functionality
        if (search) {
            query += ` AND (
                i.title ILIKE $${paramIndex} OR 
                i.caption ILIKE $${paramIndex} OR 
                i.alt_text ILIKE $${paramIndex}
            )`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        // Album filter
        if (album_id) {
            query += ` AND i.album_id = $${paramIndex}`;
            queryParams.push(album_id);
            paramIndex++;
        }

        // User filter
        if (uploaded_by) {
            query += ` AND i.uploaded_by = $${paramIndex}`;
            queryParams.push(uploaded_by);
            paramIndex++;
        }

        // Sorting
        const allowedSortFields = ['uploaded_at', 'title', 'view_count', 'size_bytes'];
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'uploaded_at';
        const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        query += ` ORDER BY i.${sortField} ${sortDirection}`;

        // Pagination
        query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const { rows } = await db.query(query, queryParams);

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(*) as total
            FROM images i
            WHERE 1=1
        `;

        const countParams = [];
        let countParamIndex = 1;

        if (!req.user) {
            countQuery += ` AND i.privacy = 'public'`;
        } else if (privacy) {
            countQuery += ` AND i.privacy = $${countParamIndex}`;
            countParams.push(privacy);
            countParamIndex++;
        }

        if (search) {
            countQuery += ` AND (
                i.title ILIKE $${countParamIndex} OR 
                i.caption ILIKE $${countParamIndex} OR 
                i.alt_text ILIKE $${countParamIndex}
            )`;
            countParams.push(`%${search}%`);
            countParamIndex++;
        }

        if (album_id) {
            countQuery += ` AND i.album_id = $${countParamIndex}`;
            countParams.push(album_id);
            countParamIndex++;
        }

        if (uploaded_by) {
            countQuery += ` AND i.uploaded_by = $${countParamIndex}`;
            countParams.push(uploaded_by);
            countParamIndex++;
        }

        const countResult = await db.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        res.json({
            success: true,
            images: rows,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get images error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Get a single image by ID
// @route   GET /api/images/:id
// @access  Public (with privacy checks)
export const getImageById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                i.*, 
                u.username as uploaded_by_name,
                a.name as album_name
            FROM images i
            LEFT JOIN users u ON i.uploaded_by = u.id
            LEFT JOIN albums a ON i.album_id = a.id
            WHERE i.id = $1
        `;
        
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Image not found' 
            });
        }
        
        const image = rows[0];

        // Privacy check
        if (image.privacy === 'private' && (!req.user || image.uploaded_by !== req.user.id)) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to view this image.' 
            });
        }

        // Increment view count
        await db.query('UPDATE images SET view_count = view_count + 1 WHERE id = $1', [id]);
        image.view_count += 1;

        res.json({
            success: true,
            image
        });

    } catch (error) {
        console.error('Get image by ID error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Update image metadata
// @route   PUT /api/images/:id
// @access  Private
export const updateImage = async (req, res) => {
    const { id } = req.params;
    const { title, caption, alt_text, privacy, license, album_id } = req.body;

    try {
        // Check if image exists and user has permission
        const checkQuery = 'SELECT uploaded_by FROM images WHERE id = $1';
        const { rows } = await db.query(checkQuery, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Image not found' 
            });
        }

        // Permission check (owner or admin)
        if (rows[0].uploaded_by !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this image' 
            });
        }

        const updateQuery = `
            UPDATE images SET 
                title = COALESCE($1, title),
                caption = COALESCE($2, caption),
                alt_text = COALESCE($3, alt_text),
                privacy = COALESCE($4, privacy),
                license = COALESCE($5, license),
                album_id = $6
            WHERE id = $7 
            RETURNING *
        `;

        const updateResult = await db.query(updateQuery, [
            title, caption, alt_text, privacy, license, album_id, id
        ]);

        res.json({
            success: true,
            message: 'Image updated successfully',
            image: updateResult.rows[0]
        });

    } catch (error) {
        console.error('Update image error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
export const deleteImage = async (req, res) => {
    const { id } = req.params;

    try {
        const checkQuery = 'SELECT storage_path, thumbnail_path, uploaded_by FROM images WHERE id = $1';
        const { rows } = await db.query(checkQuery, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Image not found' 
            });
        }
        
        const image = rows[0];

        // Permission check (owner or admin)
        if (image.uploaded_by !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this image' 
            });
        }
        
        // Delete files from filesystem
        try {
            const originalFilePath = path.join(UPLOADS_DIR, path.basename(image.storage_path));
            const thumbFilePath = path.join(THUMBNAILS_DIR, path.basename(image.thumbnail_path));
            
            await fs.unlink(originalFilePath).catch(err => 
                console.warn("Could not delete original file:", err.message)
            );
            await fs.unlink(thumbFilePath).catch(err => 
                console.warn("Could not delete thumbnail file:", err.message)
            );
        } catch (fileError) {
            console.warn('File deletion error:', fileError);
            // Continue with database deletion even if file deletion fails
        }
        
        // Delete from database
        await db.query('DELETE FROM images WHERE id = $1', [id]);
        
        res.json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Get image statistics
// @route   GET /api/images/stats
// @access  Public
export const getImageStats = async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) as total_images,
                COUNT(DISTINCT album_id) FILTER (WHERE album_id IS NOT NULL) as albums_with_images,
                SUM(size_bytes) as total_storage_bytes,
                SUM(view_count) as total_views,
                COUNT(*) FILTER (WHERE privacy = 'public') as public_images,
                COUNT(*) FILTER (WHERE privacy = 'private') as private_images
            FROM images
            ${!req.user ? "WHERE privacy = 'public'" : ''}
        `;

        const { rows } = await db.query(statsQuery);
        const stats = rows[0];

        // Get total albums count
        const albumsQuery = 'SELECT COUNT(*) as total_albums FROM albums';
        const albumsResult = await db.query(albumsQuery);

        res.json({
            success: true,
            stats: {
                totalImages: parseInt(stats.total_images),
                totalAlbums: parseInt(albumsResult.rows[0].total_albums),
                storageUsedMB: Math.round((parseInt(stats.total_storage_bytes) || 0) / 1024 / 1024 * 100) / 100,
                totalViews: parseInt(stats.total_views) || 0,
                publicImages: parseInt(stats.public_images) || 0,
                privateImages: parseInt(stats.private_images) || 0
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};