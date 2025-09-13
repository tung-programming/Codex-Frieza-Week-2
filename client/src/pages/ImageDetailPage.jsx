import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import imageService from '../services/imageService.js';
import albumService from '../services/albumService.js';
import './SharedStyles.css';
import './ImageDetailPage.css';
import './MobileStyles.css';

function ImageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, canEdit } = useAuth();

  const [image, setImage] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showExifModal, setShowExifModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    alt_text: '',
    privacy: 'public',
    license: '',
    album_id: ''
  });

  // Load image data and albums on mount
  useEffect(() => {
    Promise.all([
      loadImage(),
      loadAlbums()
    ]);
  }, [id]);

  // Load image details
  const loadImage = async () => {
    try {
      setLoading(true);
      const response = await imageService.getImageById(id);
      
      if (response.success) {
        setImage(response.image);
        setFormData({
          title: response.image.title || '',
          caption: response.image.caption || '',
          alt_text: response.image.alt_text || '',
          privacy: response.image.privacy || 'public',
          license: response.image.license || '',
          album_id: response.image.album_id || ''
        });
      } else {
        setError(response.message || 'Failed to load image');
      }
    } catch (err) {
      setError(err.message || 'Failed to load image');
    } finally {
      setLoading(false);
    }
  };

  // Load albums for dropdown
  const loadAlbums = async () => {
    try {
      const response = await albumService.getAlbums();
      if (response.success) {
        setAlbums(response.albums);
      }
    } catch (err) {
      console.error('Failed to load albums:', err);
    }
  };

  // Update image metadata
  const handleUpdateImage = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await imageService.updateImage(id, formData);
      
      if (response.success) {
        setImage(response.image);
        setEditing(false);
        setError(null);
      } else {
        setError(response.message || 'Failed to update image');
      }
    } catch (err) {
      setError(err.message || 'Failed to update image');
    } finally {
      setSaving(false);
    }
  };

  // Delete image
  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await imageService.deleteImage(id);
      
      if (response.success) {
        navigate('/gallery');
      } else {
        setError(response.message || 'Failed to delete image');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete image');
    }
  };

  // Download image
  const downloadImage = async () => {
    if (!image) return;
    
    try {
      const response = await fetch(`https://pixel-vault-ct82.onrender.com${image.storage_path}`);
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

  // Cancel editing
  const cancelEditing = () => {
    setEditing(false);
    setFormData({
      title: image.title || '',
      caption: image.caption || '',
      alt_text: image.alt_text || '',
      privacy: image.privacy || 'public',
      license: image.license || '',
      album_id: image.album_id || ''
    });
    setError(null);
  };

  // Parse EXIF data for display
  const parseExifData = (exifData) => {
    if (!exifData) return null;
    
    try {
      const parsed = typeof exifData === 'string' ? JSON.parse(exifData) : exifData;
      const exif = parsed.exif || parsed;
      
      return {
        camera: exif.Make || 'Unknown',
        model: exif.Model || 'Unknown',
        focal_length: exif.FocalLength ? `${exif.FocalLength}mm` : 'Unknown',
        aperture: exif.ApertureValue ? `f/${exif.ApertureValue}` : exif.FNumber ? `f/${exif.FNumber}` : 'Unknown',
        shutter_speed: exif.ShutterSpeedValue || exif.ExposureTime || 'Unknown',
        iso: exif.ISOSpeedRatings || exif.ISO || 'Unknown',
        date_taken: exif.DateTime || exif.DateTimeOriginal || 'Unknown',
        flash: exif.Flash ? (exif.Flash === 0 ? 'No Flash' : 'Flash Used') : 'Unknown'
      };
    } catch (err) {
      console.error('Error parsing EXIF data:', err);
      return null;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  // Keyboard navigation for modals
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showLightbox && e.key === 'Escape') {
        setShowLightbox(false);
      }
      if (showExifModal && e.key === 'Escape') {
        setShowExifModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showLightbox, showExifModal]);

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
            <div style={{ fontSize: '1.2rem' }}>Loading image...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !image) {
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
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
            <div style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>{error}</div>
            <button
              onClick={() => navigate('/gallery')}
              className="btn btn-primary"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  const exifData = parseExifData(image?.exif_data);
  const canEditImage = canEdit && canEdit(image?.uploaded_by);

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
            <h1 className="page-title">
              {image?.title || 'Image Details'}
            </h1>
          </div>

          <div className="header-actions">
            {canEditImage && (
              <>
                <button
                  onClick={() => setEditing(!editing)}
                  className={`btn ${editing ? 'btn-secondary' : 'btn btn-primary'}`}
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={handleDeleteImage}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={() => setShowLightbox(true)}
              className="btn btn-secondary"
            >
              View Full Size
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Image Display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <img
                src={imageService.getImageUrl(image?.storage_path)}
                alt={image?.alt_text || image?.title}
                style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                onClick={() => setShowLightbox(true)}
              />
            </div>

            {/* Image Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Actions</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <button
                    onClick={() => setShowLightbox(true)}
                    className="btn btn-secondary"
                  >
                    <span>👁️</span>
                    <span>View Full Size</span>
                  </button>
                  
                  <button
                    onClick={downloadImage}
                    className="btn btn-success"
                  >
                    <span>⬇️</span>
                    <span>Download</span>
                  </button>

                  {exifData && (
                    <button
                      onClick={() => setShowExifModal(true)}
                      className="btn"
                    >
                      <span>📊</span>
                      <span>View EXIF</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {editing ? (
              /* Edit Form */
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Edit Image</h2>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpdateImage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-input"
                        required
                        maxLength={255}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Caption</label>
                      <textarea
                        value={formData.caption}
                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                        className="form-textarea"
                        rows={3}
                        maxLength={1000}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alt Text</label>
                      <input
                        type="text"
                        value={formData.alt_text}
                        onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                        className="form-input"
                        maxLength={255}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Privacy</label>
                      <select
                        value={formData.privacy}
                        onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                        className="form-select"
                      >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">License</label>
                      <input
                        type="text"
                        value={formData.license}
                        onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                        className="form-input"
                        placeholder="e.g., CC BY 4.0, All Rights Reserved"
                        maxLength={100}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Album</label>
                      <select
                        value={formData.album_id}
                        onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
                        className="form-select"
                      >
                        <option value="">No Album</option>
                        {albums.map(album => (
                          <option key={album.id} value={album.id}>
                            {album.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="btn"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* View Details */
              <>
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">{image?.title}</h2>
                  </div>
                  <div className="card-body">
                    {image?.caption && (
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {image.caption}
                      </p>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Privacy:</span>
                        <span style={{
                          marginLeft: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          background: image?.privacy === 'public' ? 'rgba(34, 197, 94, 0.2)' :
                                     image?.privacy === 'unlisted' ? 'rgba(251, 191, 36, 0.2)' :
                                     'rgba(239, 68, 68, 0.2)',
                          color: image?.privacy === 'public' ? '#22c55e' :
                                 image?.privacy === 'unlisted' ? '#fbbf24' :
                                 '#ef4444'
                        }}>
                          {image?.privacy || 'Public'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Views:</span>
                        <span style={{ marginLeft: '0.5rem' }}>{image?.view_count || 0}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Size:</span>
                        <span style={{ marginLeft: '0.5rem' }}>{formatFileSize(image?.size_bytes)}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Dimensions:</span>
                        <span style={{ marginLeft: '0.5rem' }}>
                          {image?.width && image?.height ? `${image.width} × ${image.height}` : 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {image?.license && (
                      <div style={{ marginTop: '1rem' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>License:</span>
                        <span style={{ marginLeft: '0.5rem' }}>{image.license}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Technical Details</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Filename:</span>
                        <span style={{ marginLeft: '0.5rem', wordBreak: 'break-all' }}>{image?.filename}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>MIME Type:</span>
                        <span style={{ marginLeft: '0.5rem' }}>{image?.mime_type}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Uploaded:</span>
                        <span style={{ marginLeft: '0.5rem' }}>{new Date(image?.uploaded_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Uploaded by:</span>
                        <span style={{ marginLeft: '0.5rem' }}>{image?.uploaded_by_name || 'Unknown'}</span>
                      </div>
                    </div>

                    {image?.album_name && (
                      <div style={{ marginTop: '1rem' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Album:</span>
                        <button
                          onClick={() => navigate('/albums')}
                          style={{
                            marginLeft: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-cyan)',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                          }}
                        >
                          {image.album_name}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lightbox */}
        {showLightbox && (
          <div 
            className="modal-overlay"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
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
                src={imageService.getImageUrl(image?.storage_path)}
                alt={image?.alt_text || image?.title}
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
                  {image?.title}
                </h3>
                {image?.caption && (
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {image.caption}
                  </p>
                )}
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-muted)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  gap: '1rem'
                }}>
                  <span>Views: {image?.view_count}</span>
                  <span>Uploaded: {new Date(image?.uploaded_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXIF Modal */}
        {showExifModal && exifData && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">Camera Information (EXIF)</h3>
                <button
                  onClick={() => setShowExifModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Camera:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.camera}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Model:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.model}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Focal Length:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.focal_length}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Aperture:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.aperture}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Shutter Speed:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.shutter_speed}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>ISO:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.iso}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Date Taken:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.date_taken}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Flash:</span>
                    <span style={{ marginLeft: '0.5rem' }}>{exifData.flash}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Likes, Comments, and Tags */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Engagement</h3>
        </div>
        <div className="card-body">
          {/* Likes */}
          <button onClick={async () => {
            if (!user) return alert('Login required');
            if (image.userLiked) {
              await apiService.unlikeImage(id);
              setImage({ ...image, userLiked: false, likeCount: image.likeCount - 1 });
            } else {
              await apiService.likeImage(id);
              setImage({ ...image, userLiked: true, likeCount: (image.likeCount || 0) + 1 });
            }
          }} className="btn btn-primary">
            ❤️ {image.likeCount || 0}
          </button>

          {/* Tags */}
          <div style={{ marginTop: '1rem' }}>
            <strong>Tags: </strong>
            {image.tags?.length
              ? image.tags.map(tag => (
                  <span key={tag.id} style={{ marginRight: '0.5rem', color: 'var(--primary-cyan)' }}>
                    #{tag.name}
                  </span>
                ))
              : <span>No tags</span>}
          </div>

          {/* Comments */}
          <div style={{ marginTop: '1rem' }}>
            <strong>Comments</strong>
            <ul>
              {image.comments?.map(c => (
                <li key={c.id}><b>{c.username}:</b> {c.content}</li>
              ))}
            </ul>
            {user && (
              <form onSubmit={async (e) => {
                e.preventDefault();
                const content = e.target.comment.value;
                await apiService.addComment(id, content);
                const updated = await apiService.getComments(id);
                setImage({ ...image, comments: updated.comments });
                e.target.reset();
              }}>
                <input name="comment" placeholder="Write a comment..." className="form-input" />
                <button type="submit" className="btn btn-secondary">Post</button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default ImageDetailPage;