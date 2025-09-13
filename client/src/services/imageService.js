import apiService from './api.js';

class ImageService {
  // Get images with search and filters
  async getImages(params = {}) {
    return await apiService.get('/images', params);
  }

  // Get single image by ID
  async getImageById(id) {
    return await apiService.get(`/images/${id}`);
  }

  // Upload multiple images
  async uploadImages(files, metadata = {}) {
    const formData = new FormData();
    
    // Add files
    files.forEach(file => {
      formData.append('images', file);
    });

    // Add metadata
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    return await apiService.uploadFiles('/images', formData);
  }

  // Update image metadata
  async updateImage(id, data) {
    return await apiService.put(`/images/${id}`, data);
  }

  // Delete image
  async deleteImage(id) {
    return await apiService.delete(`/images/${id}`);
  }

  // Get image statistics
  async getStats() {
    return await apiService.get('/images/stats');
  }

  // Search images
  async searchImages(query, filters = {}) {
    return await apiService.get('/images', {
      search: query,
      ...filters
    });
  }

  // Filter images by album
  async getImagesByAlbum(albumId, params = {}) {
    return await apiService.get('/images', {
      album_id: albumId,
      ...params
    });
  }

  // Filter images by user
  async getImagesByUser(userId, params = {}) {
    return await apiService.get('/images', {
      uploaded_by: userId,
      ...params
    });
  }

  // Get images with pagination
  async getImagesPaginated(page = 1, limit = 20, filters = {}) {
    return await apiService.get('/images', {
      limit,
      offset: (page - 1) * limit,
      ...filters
    });
  }

  // Bulk update images (for future use)
  async bulkUpdateImages(imageIds, data) {
    // TODO: Implement bulk update endpoint
    const promises = imageIds.map(id => this.updateImage(id, data));
    return await Promise.all(promises);
  }

  // Bulk delete images (for future use)
  async bulkDeleteImages(imageIds) {
    // TODO: Implement bulk delete endpoint
    const promises = imageIds.map(id => this.deleteImage(id));
    return await Promise.all(promises);
  }

  // Get image URL for display
  getImageUrl(imagePath, baseUrl = 'https://pixel-vault-ct82.onrender.com') {
    return `${baseUrl}${imagePath}`;
  }

  // Get thumbnail URL
  getThumbnailUrl(thumbnailPath, baseUrl = 'https://pixel-vault-ct82.onrender.com') {
    return `${baseUrl}${thumbnailPath}`;
  }

  // Validate image file
  validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WEBP, AVIF, and GIF are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    return true;
  }

  // Validate multiple files
  validateImageFiles(files) {
    if (!files || files.length === 0) {
      throw new Error('No files selected.');
    }

    if (files.length > 10) {
      throw new Error('Maximum 10 files allowed per upload.');
    }

    files.forEach((file, index) => {
      try {
        this.validateImageFile(file);
      } catch (error) {
        throw new Error(`File ${index + 1}: ${error.message}`);
      }
    });

    return true;
  }
}

// Create singleton instance
const imageService = new ImageService();

export default imageService;