import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SharedStyles.css';
import './MobileStyles.css';

function GalleryPage() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Upload functionality
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  
  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:5001/api';

  // Get token from localStorage
  const getToken = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).token : null;
  };

  // API call helper
  const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('user');
      navigate('/auth');
      return null;
    }

    return response.json();
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/auth');
          return;
        }
        setUser(JSON.parse(userData));

        // Load images, albums, and stats in parallel
        const [imagesRes, albumsRes, statsRes] = await Promise.all([
          apiCall('/images'),
          apiCall('/albums'),
          apiCall('/images/stats')
        ]);

        if (imagesRes?.success) setImages(imagesRes.images);
        if (albumsRes?.success) setAlbums(albumsRes.albums);
        if (statsRes?.success) setStats(statsRes.stats);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load gallery data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Search and filter images
  useEffect(() => {
    const searchImages = async () => {
      if (!searchQuery && !selectedAlbum) {
        // Load all images
        const res = await apiCall('/images');
        if (res?.success) setImages(res.images);
        return;
      }

      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedAlbum) params.append('album_id', selectedAlbum);

      const res = await apiCall(`/images?${params}`);
      if (res?.success) setImages(res.images);
    };

    const debounceTimeout = setTimeout(searchImages, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, selectedAlbum]);

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/auth');
  };

  // File selection handler
  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    const newQueueItems = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split('.').slice(0, -1).join('.'),
      caption: '',
      altText: '',
      tags: '',
      albumId: '',
      status: 'pending' // pending, uploading, completed, error
    }));

    setUploadQueue(prev => [...prev, ...newQueueItems]);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget)) {
      dropZoneRef.current.classList.remove('drag-over');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleFileSelect(files);
      setShowUploadModal(true);
    }
  };

  // Remove file from queue
  const removeFromQueue = (id) => {
    setUploadQueue(prev => {
      const updated = prev.filter(item => item.id !== id);
      // Clean up object URL
      const item = prev.find(item => item.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return updated;
    });
  };

  // Update queue item
  const updateQueueItem = (id, updates) => {
    setUploadQueue(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Upload all files
  const handleUploadAll = async () => {
    if (uploadQueue.length === 0) return;

    setUploading(true);
    const token = getToken();

    for (const item of uploadQueue) {
      if (item.status !== 'pending') continue;

      try {
        updateQueueItem(item.id, { status: 'uploading' });
        setUploadProgress(prev => ({ ...prev, [item.id]: 0 }));

        const formData = new FormData();
        formData.append('images', item.file);
        formData.append('title', item.title);
        formData.append('caption', item.caption);
        formData.append('alt_text', item.altText);
        formData.append('tags', item.tags);
        if (item.albumId) formData.append('album_id', item.albumId);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(prev => ({ ...prev, [item.id]: progress }));
          }
        });

        const response = await new Promise((resolve, reject) => {
          xhr.onload = () => resolve(xhr);
          xhr.onerror = () => reject(new Error('Upload failed'));
          
          xhr.open('POST', `${API_BASE}/images`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });

        const result = JSON.parse(response.responseText);
        
        if (result.success) {
          updateQueueItem(item.id, { status: 'completed' });
        } else {
          updateQueueItem(item.id, { status: 'error', error: result.message });
        }
      } catch (error) {
        updateQueueItem(item.id, { status: 'error', error: error.message });
      }
    }

    setUploading(false);
    
    // Reload data
    const [imagesRes, statsRes] = await Promise.all([
      apiCall('/images'),
      apiCall('/images/stats')
    ]);
    
    if (imagesRes?.success) setImages(imagesRes.images);
    if (statsRes?.success) setStats(statsRes.stats);

    // Clear completed items after a delay
    setTimeout(() => {
      setUploadQueue(prev => prev.filter(item => item.status === 'error'));
      setUploadProgress({});
      if (uploadQueue.every(item => item.status === 'completed')) {
        setShowUploadModal(false);
      }
    }, 2000);
  };

  // Delete image
  const deleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await apiCall(`/images/${imageId}`, { method: 'DELETE' });
      if (res?.success) {
        setImages(images.filter(img => img.id !== imageId));
        // Update stats
        const statsRes = await apiCall('/images/stats');
        if (statsRes?.success) setStats(statsRes.stats);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete image');
    }
  };

  // Download image
  const downloadImage = async (image) => {
    try {
      const response = await fetch(`http://localhost:5001${image.storage_path}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = image.filename || 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download image');
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (lightboxIndex === -1) return;

      switch (e.key) {
        case 'Escape':
          setLightboxIndex(-1);
          break;
        case 'ArrowLeft':
          setLightboxIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
          break;
        case 'ArrowRight':
          setLightboxIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxIndex, images.length]);

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
            <div style={{ fontSize: '1.2rem' }}>Loading your gallery...</div>
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
            <h1 className="brand-logo">PixelVault</h1>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Welcome, {user?.username}
            </span>
          </div>

          <div className="header-actions">
            <button
              onClick={() => {
                setShowUploadModal(true);
                setUploadQueue([]);
              }}
              className="btn btn-primary"
            >
              <span>📸</span>
              <span>Upload</span>
            </button>
            <button
              onClick={() => navigate('/albums')}
              className="btn btn-secondary"
            >
              <span>📁</span>
              <span>Albums</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
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

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalImages || 0}</div>
            <div className="stat-label">Total Images</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalAlbums || 0}</div>
            <div className="stat-label">Albums</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.storageUsedMB || 0} MB</div>
            <div className="stat-label">Storage Used</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalViews || 0}</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-body">
            <div className="search-filter-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search images by title, caption, or alt text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="form-select"
                style={{ width: '200px' }}
              >
                <option value="">All Albums</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.name} ({album.image_count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div 
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="empty-state"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowUploadModal(true)}
          >
            <div className="empty-state-icon">📷</div>
            <h2 className="empty-state-title">No Images Yet</h2>
            <p className="empty-state-text">
              Drag and drop images here or click to upload your first image
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUploadModal(true);
              }}
              className="btn btn-primary"
            >
              Upload Your First Image
            </button>
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((image, index) => (
              <div key={image.id} className="image-card">
                <div className="image-card-image">
                  <img
                    src={`http://localhost:5001${image.thumbnail_path}`}
                    alt={image.alt_text || image.title}
                    loading="lazy"
                  />
                  <div className="image-card-overlay">
                    <button
                      onClick={() => setLightboxIndex(index)}
                      className="btn"
                      style={{ padding: '0.5rem', minWidth: 'auto' }}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => navigate(`/images/${image.id}`)}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem', minWidth: 'auto' }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => downloadImage(image)}
                      className="btn btn-success"
                      style={{ padding: '0.5rem', minWidth: 'auto' }}
                      title="Download"
                    >
                      ⬇️
                    </button>
                    {(user?.role === 'Admin' || image.uploaded_by === user?.id) && (
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem', minWidth: 'auto' }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                <div className="image-card-content">
                  <h3 className="image-card-title">{image.title}</h3>
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

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal upload-modal" style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Upload Images</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadQueue([]);
                    setUploadProgress({});
                  }}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                {/* File Drop Zone */}
                {uploadQueue.length === 0 && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="empty-state"
                    style={{ margin: 0, cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="empty-state-icon">📁</div>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                      Drag and drop images here or click to browse
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={uploading}
                    >
                      Choose Files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}

                {/* Upload Queue */}
                {uploadQueue.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4>Files to Upload ({uploadQueue.length})</h4>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn"
                        disabled={uploading}
                      >
                        Add More Files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        style={{ display: 'none' }}
                      />
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {uploadQueue.map((item) => (
                        <div key={item.id} className="card upload-queue-item">
                          <div className="card-body" style={{ padding: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1rem', alignItems: 'start' }}>
                              <img
                                src={item.preview}
                                alt="Preview"
                                className="upload-queue-preview"
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                              
                              <div className="upload-queue-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label">Title</label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateQueueItem(item.id, { title: e.target.value })}
                                    className="form-input"
                                    disabled={uploading}
                                  />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label">Caption</label>
                                  <input
                                    type="text"
                                    value={item.caption}
                                    onChange={(e) => updateQueueItem(item.id, { caption: e.target.value })}
                                    className="form-input"
                                    disabled={uploading}
                                  />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label">Alt Text</label>
                                  <input
                                    type="text"
                                    value={item.altText}
                                    onChange={(e) => updateQueueItem(item.id, { altText: e.target.value })}
                                    className="form-input"
                                    disabled={uploading}
                                  />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label">Album</label>
                                  <select
                                    value={item.albumId}
                                    onChange={(e) => updateQueueItem(item.id, { albumId: e.target.value })}
                                    className="form-select"
                                    disabled={uploading}
                                  >
                                    <option value="">No Album</option>
                                    {albums.map(album => (
                                      <option key={album.id} value={album.id}>
                                        {album.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                {item.status === 'pending' && !uploading && (
                                  <button
                                    onClick={() => removeFromQueue(item.id)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.25rem', minWidth: 'auto' }}
                                  >
                                    ×
                                  </button>
                                )}
                                
                                {item.status === 'uploading' && (
                                  <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                    <div className="loading-spinner" style={{ margin: '0 auto 0.5rem' }}></div>
                                    <div style={{ fontSize: '0.75rem' }}>{uploadProgress[item.id] || 0}%</div>
                                  </div>
                                )}
                                
                                {item.status === 'completed' && (
                                  <div style={{ color: '#22c55e', fontSize: '1.5rem' }}>✓</div>
                                )}
                                
                                {item.status === 'error' && (
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#ef4444', fontSize: '1.5rem' }}>✗</div>
                                    <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                                      {item.error}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {uploadQueue.length > 0 && (
                <div className="modal-footer">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadQueue([]);
                      setUploadProgress({});
                    }}
                    className="btn"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadAll}
                    className="btn btn-primary"
                    disabled={uploading || uploadQueue.length === 0}
                  >
                    {uploading ? 'Uploading...' : `Upload All (${uploadQueue.length})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxIndex >= 0 && (
          <div 
            className="modal-overlay" 
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            onClick={() => setLightboxIndex(-1)}
          >
            <button
              onClick={() => setLightboxIndex(-1)}
              className="lightbox-navigation"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                zIndex: 10,
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              ×
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
              }}
              className="lightbox-navigation"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              ‹
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
              }}
              className="lightbox-navigation"
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              ›
            </button>

            <div 
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '90vh', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`http://localhost:5001${images[lightboxIndex]?.storage_path}`}
                alt={images[lightboxIndex]?.alt_text || images[lightboxIndex]?.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
              
              <div 
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '1rem',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {images[lightboxIndex]?.title}
                </h3>
                {images[lightboxIndex]?.caption && (
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {images[lightboxIndex]?.caption}
                  </p>
                )}
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <span>Views: {images[lightboxIndex]?.view_count}</span>
                  <span>Uploaded: {new Date(images[lightboxIndex]?.uploaded_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryPage;