import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import './ImageUpload.css';

const ImageUpload = ({ 
  label, 
  currentImage, 
  portfolioType, 
  imageType, // 'profile' or 'cover'
  onUploadSuccess,
  onDelete
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('portfolioType', portfolioType);

      const endpoint = imageType === 'profile' 
        ? 'http://localhost:5000/api/upload/profile-image'
        : 'http://localhost:5000/api/upload/cover-image';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const fullImagePath = `http://localhost:5000${data.imagePath}`;
        setPreview(fullImagePath);
        onUploadSuccess(fullImagePath);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${imageType} image?`)) {
      return;
    }

    try {
      const endpoint = imageType === 'profile'
        ? `http://localhost:5000/api/upload/profile-image/${portfolioType}`
        : `http://localhost:5000/api/upload/cover-image/${portfolioType}`;

      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setPreview('');
        onDelete();
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">{label}</label>
      
      <div className="image-upload-content">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt={`${label} preview`} />
            <div className="image-overlay">
              <button 
                type="button" 
                className="btn-delete-image"
                onClick={handleDelete}
                title="Delete image"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="image-placeholder">
            <FaImage size={48} />
            <p>No image uploaded</p>
          </div>
        )}

        <div className="image-upload-actions">
          <label className="btn-upload" htmlFor={`upload-${imageType}-${portfolioType}`}>
            <FaUpload /> {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
          </label>
          <input
            type="file"
            id={`upload-${imageType}-${portfolioType}`}
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <small className="upload-hint">
            Max size: 5MB | Formats: JPG, PNG, GIF, WebP
          </small>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
