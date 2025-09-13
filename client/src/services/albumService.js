import apiService from './api.js';

class AlbumService {
  // Get all albums
  async getAlbums() {
    return await apiService.get('/albums');
  }

  // Get single album by ID with images
  async getAlbumById(id) {
    return await apiService.get(`/albums/${id}`);
  }

  // Create new album
  async createAlbum(data) {
    return await apiService.post('/albums', data);
  }

  // Update album
  async updateAlbum(id, data) {
    return await apiService.put(`/albums/${id}`, data);
  }

  // Delete album
  async deleteAlbum(id) {
    return await apiService.delete(`/albums/${id}`);
  }

  // Get albums with image counts
  async getAlbumsWithStats() {
    return await apiService.get('/albums');
  }

  // Set album cover image
  async updateAlbumThumbnail(albumId, imageId) {
    return await apiService.put(`/albums/${albumId}`, {
      cover_image_id: imageId
    });
  }

  // Remove image from album
  async removeImageFromAlbum(imageId) {
    // This would update the image to remove album_id
    return await apiService.put(`/images/${imageId}`, {
      album_id: null
    });
  }

  // Add image to album
  async addImageToAlbum(imageId, albumId) {
    return await apiService.put(`/images/${imageId}`, {
      album_id: albumId
    });
  }

  // Validate album data
  validateAlbumData(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Album name is required');
    }

    if (data.name.length > 255) {
      throw new Error('Album name must be less than 255 characters');
    }

    if (data.description && data.description.length > 1000) {
      throw new Error('Album description must be less than 1000 characters');
    }

    return true;
  }

  // Get albums by user (for editors to see their own albums)
  async getAlbumsByUser(userId) {
    // This would require a backend endpoint, for now we filter on frontend
    const response = await this.getAlbums();
    if (response.success) {
      return {
        ...response,
        albums: response.albums.filter(album => album.created_by === userId)
      };
    }
    return response;
  }

  // Search albums
  async searchAlbums(query) {
    const response = await this.getAlbums();
    if (response.success && query) {
      return {
        ...response,
        albums: response.albums.filter(album =>
          album.name.toLowerCase().includes(query.toLowerCase()) ||
          (album.description && album.description.toLowerCase().includes(query.toLowerCase()))
        )
      };
    }
    return response;
  }

  // Get album cover URL
  getAlbumCoverUrl(album, baseUrl = 'https://pixel-vault-ct82.onrender.com') {
    if (album.cover_thumbnail) {
      return `${baseUrl}${album.cover_thumbnail}`;
    }
    return null; // Return null if no cover image
  }

  // Bulk operations (for future use)
  async bulkDeleteAlbums(albumIds) {
    const promises = albumIds.map(id => this.deleteAlbum(id));
    return await Promise.all(promises);
  }

  // Get album stats
  async getAlbumStats(albumId) {
    const album = await this.getAlbumById(albumId);
    if (album.success) {
      const stats = {
        imageCount: album.album.images?.length || 0,
        totalViews: album.album.images?.reduce((sum, img) => sum + (img.view_count || 0), 0) || 0,
        lastUpdated: album.album.images?.length > 0 
          ? Math.max(...album.album.images.map(img => new Date(img.uploaded_at).getTime()))
          : new Date(album.album.created_at).getTime(),
        storageUsed: album.album.images?.reduce((sum, img) => sum + (img.size_bytes || 0), 0) || 0
      };
      return { success: true, stats };
    }
    return album;
  }
}

// Create singleton instance
const albumService = new AlbumService();

export default albumService;