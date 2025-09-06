import db from '../config/db.js';

// @desc    Create a new album
// @route   POST /api/albums
// @access  Private
export const createAlbum = async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Album title is required' });
    }
    try {
        const query = 'INSERT INTO albums (title, description, created_by_id) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await db.query(query, [title, description || null, req.user.id]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
export const getAlbums = async (req, res) => {
     try {
        const { rows } = await db.query('SELECT * FROM albums ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single album by ID with its images
// @route   GET /api/albums/:id
// @access  Public
export const getAlbumById = async (req, res) => {
    const { id } = req.params;
    try {
        // Get album details
        const albumResult = await db.query('SELECT * FROM albums WHERE id = $1', [id]);
        if (albumResult.rows.length === 0) {
            return res.status(404).json({ message: 'Album not found' });
        }

        // Get images in the album
        const imagesQuery = `
            SELECT i.id, i.title, i.thumbnail_path, i.alt_text 
            FROM images i
            JOIN image_albums ia ON i.id = ia.image_id
            WHERE ia.album_id = $1 AND i.privacy = 'public'
        `;
        const imagesResult = await db.query(imagesQuery, [id]);

        const album = albumResult.rows[0];
        album.images = imagesResult.rows;

        res.json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an album
// @route   PUT /api/albums/:id
// @access  Private
export const updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    
    try {
        const { rows } = await db.query('SELECT created_by_id FROM albums WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Album not found' });

        if (rows[0].created_by_id !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to update this album' });
        }

        const query = 'UPDATE albums SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
        const result = await db.query(query, [title, description, id]);
        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Delete an album
// @route   DELETE /api/albums/:id
// @access  Private
export const deleteAlbum = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query('SELECT created_by_id FROM albums WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Album not found' });

        if (rows[0].created_by_id !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to delete this album' });
        }

        await db.query('DELETE FROM albums WHERE id = $1', [id]);
        res.json({ message: 'Album deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add an image to an album
// @route   POST /api/albums/:id/images
// @access  Private
export const addImageToAlbum = async (req, res) => {
    const { id: album_id } = req.params;
    const { image_id } = req.body;

    try {
        const { rows } = await db.query('SELECT created_by_id FROM albums WHERE id = $1', [album_id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Album not found' });

        if (rows[0].created_by_id !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to modify this album' });
        }
        
        const query = 'INSERT INTO image_albums (album_id, image_id) VALUES ($1, $2) RETURNING *';
        const result = await db.query(query, [album_id, image_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if(error.code === '23505') { // unique_violation
            return res.status(400).json({ message: 'Image already in album.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};