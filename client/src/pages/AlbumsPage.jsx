import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import albumService from '../services/albumService.js';
import imageService from '../services/imageService.js';
import './SharedStyles.css';
import './MobileStyles.css';

function AlbumsPage() {
  const { user, isEditorOrAdmin, canEdit } = useAuth();
  const navigate = useNavigate();
  
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Load albums on component mount
  useEffect(() => {
    loadAlbums();
  }, []);

  // Load albums from API
  const loadAlbums = async () => {
    try {
      setLoading(true);
      const response = await albumService.getAlbums();
      
      if (response.success) {
        setAlbums(response.albums);
      } else {
        setError(response.message || 'Failed to load albums');
      }
    } catch (err) {
      setError(err.message || 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  // Load images for selected album
  const loadAlbumImages = async (albumId) => {
    try {
      setLoadingImages(true);
      const response = await albumService.getAlbumById(albumId);
      
      if (response.success) {
        setAlbumImages(response.album.images || []);
      } else {
        setError(response.message || 'Failed to load album images');
      }
    } catch (err) {
      setError(err.message || 'Failed to load album images');
    } finally {
      setLoadingImages(false);
    }
  };

  // Create new album
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    
    try {
      albumService.validateAlbumData(formData);
      
      const response = await albumService.createAlbum(formData);
      
      if (response.success) {
        setAlbums([response.album, ...albums]);
        setShowCreateModal(false);
        setFormData({ name: '', description: '' });
        setError(null);
      } else {
        setError(response.message || 'Failed to create album');
      }
    } catch (err) {
      setError(err.message || 'Failed to create album');
    }
  };

  // Update album
  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    
    try {
      albumService.validateAlbumData(formData);
      
      const response = await albumService.updateAlbum(editingAlbum.id, formData);
      
      if (response.success) {
        setAlbums(albums.map(album => 
          album.id === editingAlbum.id ? response.album : album
        ));
        setEditingAlbum(null);
        setFormData({ name: '', description: '' });
        setError(null);
      } else {
        setError(response.message || 'Failed to update album');
      }
    } catch (err) {
      setError(err.message || 'Failed to update album');
    }
  };

  // Delete album
  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Are you sure you want to delete "${album.name}"? Images in this album will not be deleted.`)) {
      return;
    }

    try {
      const response = await albumService.deleteAlbum(album.id);
      
      if (response.success) {
        setAlbums(albums.filter(a => a.id !== album.id));
        if (selectedAlbum?.id === album.id) {
          setSelectedAlbum(null);
          setAlbumImages([]);
        }
        setError(null);
      } else {
        setError(response.message || 'Failed to delete album');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete album');
    }
  };

  // Open album and load images
  const openAlbum = (album) => {
    setSelectedAlbum(album);
    loadAlbumImages(album.id);
  };

  // Close album view
  const closeAlbum = () => {
    setSelectedAlbum(null);
    setAlbumImages([]);
  };

  // Edit album
  const startEditingAlbum = (album) => {
    setEditingAlbum(album);
    setFormData({
      name: album.name,
      description: album.description || ''
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingAlbum(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  // Filter albums by search query
  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (album.description && album.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ width: '40px', height: '40px', marginBottom: '1rem' }}></div>
            <div style={{ fontSize: '1.2rem' }}>Loading albums...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/gallery')}
              className="btn"
              style={{ background: 'none', border: 'none', color: 'var(--primary-cyan)', padding: '0.5rem' }}
            >
              ← Back to Gallery
            </button>
            <h1 className="page-title">Albums</h1>
          </div>

          {isEditorOrAdmin() && (
            <div className="header-actions">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <span>+</span>
                <span>New Album</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.25rem' }}
            >
              ×
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-body">
            <input
              type="text"
              placeholder="Search albums by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Albums Grid or Selected Album View */}
        {selectedAlbum ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Album Header */}
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {selectedAlbum.name}
                    </h2>
                    {selectedAlbum.description && (
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {selectedAlbum.description}
                      </p>
                    )}
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <span>{selectedAlbum.image_count} images</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>Created by {selectedAlbum.created_by_name}</span>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      <span>{new Date(selectedAlbum.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {canEdit(selectedAlbum.created_by) && (
                      <button
                        onClick={() => startEditingAlbum(selectedAlbum)}
                        className="btn btn-secondary"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={closeAlbum}
                      className="btn"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Album Images */}
            {loadingImages ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', marginBottom: '1rem' }}></div>
                <div style={{ color: 'var(--text-muted)' }}>Loading images...</div>
              </div>
            ) : albumImages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📷</div>
                <h3 className="empty-state-title">No Images in Album</h3>
                <p className="empty-state-text">
                  Upload images to the gallery and assign them to this album
                </p>
              </div>
            ) : (
              <div className="gallery-grid">
                {albumImages.map((image) => (
                  <div key={image.id} className="image-card">
                    <div className="image-card-image">
                      <img
                        src={imageService.getThumbnailUrl(image.thumbnail_path)}
                        alt={image.alt_text || image.title}
                        loading="lazy"
                      />
                      <div className="image-card-overlay">
                        <button
                          onClick={() => navigate(`/images/${image.id}`)}
                          className="btn"
                          style={{ padding: '0.5rem', minWidth: 'auto' }}
                          title="View Details"
                        >
                          👁️
                        </button>
                      </div>
                    </div>
                    <div className="image-card-content">
                      <h4 className="image-card-title">{image.title}</h4>
                      {image.caption && (
                        <p className="image-card-caption">{image.caption}</p>
                      )}
                      <div className="image-card-meta">
                        <span>{image.view_count} views</span>
                        <span>{new Date(image.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Albums Grid */
          <div>
            {filteredAlbums.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📁</div>
                <h2 className="empty-state-title">
                  {albums.length === 0 ? 'No Albums Yet' : 'No Albums Found'}
                </h2>
                <p className="empty-state-text">
                  {albums.length === 0 
                    ? 'Create your first album to organize your images'
                    : 'Try adjusting your search terms'
                  }
                </p>
                {albums.length === 0 && isEditorOrAdmin() && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    Create Your First Album
                  </button>
                )}
              </div>
            ) : (
              <div className="gallery-grid">
                {filteredAlbums.map((album) => (
                  <div key={album.id} className="image-card">
                    <div 
                      className="image-card-image"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openAlbum(album)}
                    >
                      {album.cover_thumbnail ? (
                        <img
                          src={albumService.getAlbumCoverUrl(album)}
                          alt={`${album.name} cover`}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(0, 212, 255, 0.2))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{ fontSize: '4rem', color: 'var(--primary-purple)' }}>📁</div>
                        </div>
                      )}
                      <div className="image-card-overlay">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAlbum(album);
                          }}
                          className="btn"
                          style={{ padding: '0.5rem', minWidth: 'auto' }}
                          title="View Album"
                        >
                          👁️
                        </button>
                        {canEdit(album.created_by) && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingAlbum(album);
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '0.5rem', minWidth: 'auto' }}
                              title="Edit Album"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAlbum(album);
                              }}
                              className="btn btn-danger"
                              style={{ padding: '0.5rem', minWidth: 'auto' }}
                              title="Delete Album"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="image-card-content">
                      <h3 className="image-card-title">{album.name}</h3>
                      {album.description && (
                        <p className="image-card-caption">{album.description}</p>
                      )}
                      <div className="image-card-meta">
                        <span>{album.image_count} images</span>
                        <span>{new Date(album.created_at).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        by {album.created_by_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Album Modal */}
        {(showCreateModal || editingAlbum) && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingAlbum ? 'Edit Album' : 'Create New Album'}
                </h3>
                <button
                  onClick={() => {
                    if (editingAlbum) {
                      cancelEditing();
                    } else {
                      setShowCreateModal(false);
                      setFormData({ name: '', description: '' });
                    }
                  }}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}>
                  <div className="form-group">
                    <label className="form-label">
                      Album Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="Enter album name"
                      required
                      maxLength={255}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="form-textarea"
                      placeholder="Enter album description"
                      rows={3}
                      maxLength={1000}
                    />
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    if (editingAlbum) {
                      cancelEditing();
                    } else {
                      setShowCreateModal(false);
                      setFormData({ name: '', description: '' });
                    }
                  }}
                  className="btn"
                >
                  Cancel
                </button>
                <button
                  onClick={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}
                  className="btn btn-primary"
                >
                  {editingAlbum ? 'Update Album' : 'Create Album'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumsPage;