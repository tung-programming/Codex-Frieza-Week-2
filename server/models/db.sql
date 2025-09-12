-- Drop existing tables if they exist (for fresh install)
-- Uncomment these lines if you need to reset the database
 DROP TABLE IF EXISTS likes CASCADE;
 DROP TABLE IF EXISTS comments CASCADE;
 DROP TABLE IF EXISTS image_tags CASCADE;
 DROP TABLE IF EXISTS tags CASCADE;
 DROP TABLE IF EXISTS images CASCADE;
 DROP TABLE IF EXISTS albums CASCADE;
 DROP TABLE IF EXISTS users CASCADE;

--Drop existing enum types if they exist
DROP TYPE IF EXISTS privacy_level CASCADE;
 DROP TYPE IF EXISTS user_role CASCADE;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles enum type for better performance and consistency
CREATE TYPE user_role AS ENUM ('Admin', 'Editor', 'Visitor');
CREATE TYPE privacy_level AS ENUM ('public', 'private', 'unlisted');

-- Users Table: Stores user information with Google OAuth support
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Optional for OAuth users
    google_id VARCHAR(255) UNIQUE, -- Google OAuth ID
    profile_picture TEXT, -- Google profile picture URL or uploaded avatar
    role user_role DEFAULT 'Editor', -- Default role changed to Editor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (length(username) >= 3)
);

-- Albums Table: Global albums that any image can belong to
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_id UUID, -- Reference to cover image (will be set after images table)
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_album_name CHECK (length(trim(name)) >= 1)
);

-- Images Table: Stores metadata for each uploaded image
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    alt_text VARCHAR(255),
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    size_bytes BIGINT,
    privacy privacy_level DEFAULT 'public',
    license VARCHAR(100),
    exif_data JSONB, -- Store camera/technical metadata
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_image_title CHECK (length(trim(title)) >= 1),
    CONSTRAINT valid_dimensions CHECK ((width IS NULL AND height IS NULL) OR (width > 0 AND height > 0)),
    CONSTRAINT valid_size CHECK (size_bytes IS NULL OR size_bytes > 0),
    CONSTRAINT valid_view_count CHECK (view_count >= 0)
);

-- Add foreign key constraint for album cover image (after images table exists)
ALTER TABLE albums 
ADD CONSTRAINT fk_cover_image 
FOREIGN KEY (cover_image_id) REFERENCES images(id) ON DELETE SET NULL;

-- Tags Table: Stores unique tags for categorization
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_tag_name CHECK (length(trim(name)) >= 1)
);

-- Image Tags Join Table: Maps images to tags (many-to-many)
CREATE TABLE image_tags (
    image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_id, tag_id)
);

-- Comments Table: For future feature - user comments on images
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    image_id UUID REFERENCES images(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_comment_content CHECK (length(trim(content)) >= 1)
);

-- Likes Table: For future feature - user likes on images
CREATE TABLE likes (
    image_id UUID REFERENCES images(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_id, user_id)
);

-- Performance Indexes
CREATE INDEX idx_images_uploaded_by ON images(uploaded_by);
CREATE INDEX idx_images_album_id ON images(album_id);
CREATE INDEX idx_images_privacy ON images(privacy);
CREATE INDEX idx_images_uploaded_at ON images(uploaded_at DESC);
CREATE INDEX idx_images_view_count ON images(view_count DESC);
CREATE INDEX idx_albums_created_by ON albums(created_by);
CREATE INDEX idx_albums_created_at ON albums(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_comments_image_id ON comments(image_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_likes_image_id ON likes(image_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Full-text search indexes for better search performance
CREATE INDEX idx_images_search ON images USING gin(to_tsvector('english', 
    title || ' ' || COALESCE(caption, '') || ' ' || COALESCE(alt_text, '')
));
CREATE INDEX idx_albums_search ON albums USING gin(to_tsvector('english', 
    name || ' ' || COALESCE(description, '')
));

-- Functions and Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the update trigger to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count safely
CREATE OR REPLACE FUNCTION increment_view_count(image_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE images 
    SET view_count = view_count + 1 
    WHERE id = image_uuid;
END;
$$ LANGUAGE plpgsql;

-- Insert default admin user (password: 'admin123' - CHANGE IN PRODUCTION!)
-- Password hash generated with bcrypt rounds=12
INSERT INTO users (username, email, password_hash, role) 
VALUES (
    'admin', 
    'admin@pixelvault.com', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewsxnvfSZjXw.B6G', -- 'admin123' 
    'Admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample editor user (password: 'editor123')
-- Password hash generated with bcrypt rounds=12
INSERT INTO users (username, email, password_hash, role) 
VALUES (
    'editor', 
    'editor@pixelvault.com', 
    '$2b$12$8Y.VQVk2nxKs8R5cJmKnKOEzT6WlN0Yk1OVKCnLGH8mGnFvDQFe8u', -- 'editor123'
    'Editor'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample visitor user (password: 'visitor123')
-- Password hash generated with bcrypt rounds=12
INSERT INTO users (username, email, password_hash, role) 
VALUES (
    'visitor', 
    'visitor@pixelvault.com', 
    '$2b$12$9Z.WRWl3oyLt9S6dKnLoLPF0U7XmO1Zm2PVLDmMHI9nHoGwEREf9y', -- 'visitor123'
    'Visitor'
) ON CONFLICT (email) DO NOTHING;

-- Create sample albums
INSERT INTO albums (name, description, created_by) 
SELECT 
    'Nature Photography', 
    'Beautiful landscapes and wildlife photography',
    u.id
FROM users u WHERE u.email = 'editor@pixelvault.com'
ON CONFLICT DO NOTHING;

INSERT INTO albums (name, description, created_by) 
SELECT 
    'Urban Exploration', 
    'City streets, architecture, and urban life',
    u.id
FROM users u WHERE u.email = 'admin@pixelvault.com'
ON CONFLICT DO NOTHING;

-- Create some sample tags
INSERT INTO tags (name) VALUES 
    ('nature'),
    ('landscape'),
    ('portrait'),
    ('urban'),
    ('architecture'),
    ('wildlife'),
    ('street'),
    ('macro'),
    ('sunset'),
    ('cityscape')
ON CONFLICT (name) DO NOTHING;

-- Views for common queries (performance optimization)
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    COUNT(DISTINCT i.id) as image_count,
    COUNT(DISTINCT a.id) as album_count,
    COALESCE(SUM(i.size_bytes), 0) as total_storage_bytes,
    COALESCE(SUM(i.view_count), 0) as total_views
FROM users u
LEFT JOIN images i ON u.id = i.uploaded_by
LEFT JOIN albums a ON u.id = a.created_by
GROUP BY u.id, u.username, u.email, u.role;

CREATE OR REPLACE VIEW public_images_with_details AS
SELECT 
    i.*,
    u.username as uploaded_by_name,
    a.name as album_name,
    ARRAY_AGG(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL) as tags
FROM images i
LEFT JOIN users u ON i.uploaded_by = u.id
LEFT JOIN albums a ON i.album_id = a.id
LEFT JOIN image_tags it ON i.id = it.image_id
LEFT JOIN tags t ON it.tag_id = t.id
WHERE i.privacy = 'public'
GROUP BY i.id, u.username, a.name
ORDER BY i.uploaded_at DESC;

CREATE OR REPLACE VIEW album_stats AS
SELECT 
    a.id,
    a.name,
    a.description,
    a.created_by,
    u.username as created_by_name,
    a.created_at,
    a.updated_at,
    COUNT(i.id) as image_count,
    COALESCE(SUM(i.size_bytes), 0) as total_size_bytes,
    COALESCE(SUM(i.view_count), 0) as total_views,
    COALESCE(i_cover.thumbnail_path, 
        (SELECT i2.thumbnail_path FROM images i2 WHERE i2.album_id = a.id AND i2.privacy = 'public' LIMIT 1)
    ) as cover_thumbnail
FROM albums a
LEFT JOIN users u ON a.created_by = u.id
LEFT JOIN images i ON a.id = i.album_id AND i.privacy = 'public'
LEFT JOIN images i_cover ON a.cover_image_id = i_cover.id
GROUP BY a.id, a.name, a.description, a.created_by, u.username, a.created_at, a.updated_at, i_cover.thumbnail_path
ORDER BY a.created_at DESC;

-- Security: Row Level Security (RLS) policies
-- Enable RLS on sensitive tables
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Images policies
--CREATE POLICY "Public images are viewable by everyone" ON images
 --   FOR SELECT USING (privacy = 'public');

--CREATE POLICY "Users can view their own images" ON images
 --   FOR SELECT USING (auth.uid() = uploaded_by);

--CREATE POLICY "Admins can view all images" ON images
  --  FOR ALL USING (
    --    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
   -- );

--CREATE POLICY "Users can insert their own images" ON images
 --   FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

--CREATE POLICY "Users can update their own images" ON images
  --  FOR UPDATE USING (auth.uid() = uploaded_by);

--CREATE POLICY "Users can delete their own images" ON images
  --  FOR DELETE USING (auth.uid() = uploaded_by);

-- Albums policies
--CREATE POLICY "Albums are viewable by everyone" ON albums
 --   FOR SELECT USING (true);

--CREATE POLICY "Editors and Admins can create albums" ON albums
  --  FOR INSERT WITH CHECK (
    --    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('Editor', 'Admin'))
    --);

--CREATE POLICY "Users can update their own albums" ON albums
  --  FOR UPDATE USING (auth.uid() = created_by);

--CREATE POLICY "Users can delete their own albums" ON albums
  --  FOR DELETE USING (auth.uid() = created_by);

-- Comments policies
--CREATE POLICY "Comments are viewable by everyone" ON comments
  --  FOR SELECT USING (true);

--CREATE POLICY "Authenticated users can create comments" ON comments
 --   FOR INSERT WITH CHECK (auth.uid() = user_id);

--CREATE POLICY "Users can update their own comments" ON comments
  --  FOR UPDATE USING (auth.uid() = user_id);

--CREATE POLICY "Users can delete their own comments" ON comments
  --  FOR DELETE USING (auth.uid() = user_id);

-- Function to get current authenticated user ID (placeholder for JWT integration)
--CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $
--BEGIN
    -- This is a placeholder. In a real implementation, this would extract
    -- the user ID from the JWT token or session
  --  RETURN NULL;
--END;
--$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $
BEGIN
    -- Delete orphaned tags (not used by any images)
    DELETE FROM tags 
    WHERE id NOT IN (SELECT DISTINCT tag_id FROM image_tags WHERE tag_id IS NOT NULL);
    
    -- Could add more cleanup logic here
    -- e.g., soft-delete old images, compress old data, etc.
END;
$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');

COMMIT;