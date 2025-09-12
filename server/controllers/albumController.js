import db from '../config/db.js';

// @desc    Create a new album
// @route   POST /api/albums
// @access  Private (Editor/Admin)
export const createAlbum = async (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ 
            success: false, 
            message: 'Album name is required' 
        });
    }

    // Check if user has permission (Editor or Admin)
    if (!req.user || (req.user.role !== 'Editor' && req.user.role !== 'Admin')) {
        return res.status(403).json({ 
            success: false, 
            message: 'Not authorized to create albums' 
        });
    }

    try {
        const query = `
            INSERT INTO albums (name, description, created_by) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
        const { rows } = await db.query(query, [name, description || null, req.user.id]);
        
        res.status(201).json({
            success: true,
            message: 'Album created successfully',
            album: rows[0]
        });
    } catch (error) {
        console.error('Create album error:', error);
        if (error.code === '23505') { // unique_violation
            res.status(400).json({ 
                success: false, 
                message: 'Album with this name already exists' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Server error' 
            });
        }
    }
};

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
export const getAlbums = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.*,
                u.username as created_by_name,
                COUNT(i.id) as image_count,
                COALESCE(i_cover.thumbnail_path, 
                    (SELECT i2.thumbnail_path FROM images i2 WHERE i2.album_id = a.id LIMIT 1)
                ) as cover_thumbnail
            FROM albums a
            LEFT JOIN users u ON a.created_by = u.id
            LEFT JOIN images i ON i.album_id = a.id AND i.privacy = 'public'
            LEFT JOIN images i_cover ON a.cover_image_id = i_cover.id
            GROUP BY a.id, u.username, i_cover.thumbnail_path
            ORDER BY a.created_at DESC
        `;
        
        const { rows } = await db.query(query);
        
        res.json({
            success: true,
            albums: rows
        });
    } catch (error) {
        console.error('Get albums error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Get a single album by ID with its images
// @route   GET /api/albums/:id
// @access  Public
export const getAlbumById = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get album details
        const albumQuery = `
            SELECT 
                a.*,
                u.username as created_by_name
            FROM albums a
            LEFT JOIN users u ON a.created_by = u.id
            WHERE a.id = $1
        `;
        const albumResult = await db.query(albumQuery, [id]);
        
        if (albumResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Album not found' 
            });
        }

        // Get images in the album
        const imagesQuery = `
            SELECT 
                i.id, i.title, i.caption, i.alt_text, i.thumbnail_path, 
                i.storage_path, i.width, i.height, i.uploaded_at,
                i.view_count, u.username as uploaded_by_name
            FROM images i
            LEFT JOIN users u ON i.uploaded_by = u.id
            WHERE i.album_id = $1 
            ${!req.user ? "AND i.privacy = 'public'" : ''}
            ORDER BY i.uploaded_at DESC
        `;
        const imagesResult = await db.query(imagesQuery, [id]);

        const album = albumResult.rows[0];
        album.images = imagesResult.rows;
        album.image_count = imagesResult.rows.length;

        res.json({
            success: true,
            album
        });
    } catch (error) {
        console.error('Get album by ID error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Update an album
// @route   PUT /api/albums/:id
// @access  Private
export const updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { name, description, cover_image_id } = req.body;
    
    try {
        const { rows } = await db.query('SELECT created_by FROM albums WHERE id = $1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Album not found' 
            });
        }

        // Permission check (owner or admin)
        if (rows[0].created_by !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this album' 
            });
        }

        const query = `
            UPDATE albums SET 
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                cover_image_id = $3,
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = $4 
            RETURNING *
        `;
        const result = await db.query(query, [name, description, cover_image_id, id]);

        res.json({
            success: true,
            message: 'Album updated successfully',
            album: result.rows[0]
        });

    } catch (error) {
        console.error('Update album error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Delete an album
// @route   DELETE /api/albums/:id
// @access  Private
export const deleteAlbum = async (req, res) => {
    const { id } = req.params;
    
    try {
        const { rows } = await db.query('SELECT created_by FROM albums WHERE id = $1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Album not found' 
            });
        }

        // Permission check (owner or admin)
        if (rows[0].created_by !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this album' 
            });
        }

        // Remove album reference from images (don't delete the images)
        await db.query('UPDATE images SET album_id = NULL WHERE album_id = $1', [id]);
        
        // Delete the album
        await db.query('DELETE FROM albums WHERE id = $1', [id]);
        
        res.json({
            success: true,
            message: 'Album deleted successfully'
        });
    } catch (error) {
        console.error('Delete album error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};