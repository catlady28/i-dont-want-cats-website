import React, { useState } from 'react';
import { Camera, Check, X, Upload, AlertTriangle } from 'lucide-react';
import { sanitizeInput, validate } from '../utils/security';

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (src: string) => void;
  className?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onSave,
  className = '',
  aspectRatio = 'square'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSrc, setNewSrc] = useState(src);
  const [previewSrc, setPreviewSrc] = useState(src);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateImageUrl = (url: string): boolean => {
    setError('');

    if (!url.trim()) {
      setError('Image URL is required');
      return false;
    }

    const sanitizedUrl = sanitizeInput.url(url);
    if (!sanitizedUrl) {
      setError('Please enter a valid URL');
      return false;
    }

    // Check if URL points to an image
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
    const isImageUrl = imageExtensions.test(url) || url.includes('pexels.com') || url.includes('unsplash.com');
    
    if (!isImageUrl) {
      setError('URL must point to an image file');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateImageUrl(newSrc)) {
      return;
    }

    const sanitizedUrl = sanitizeInput.url(newSrc);
    if (sanitizedUrl) {
      onSave(sanitizedUrl);
      setPreviewSrc(sanitizedUrl);
      setIsEditing(false);
      setError('');
    }
  };

  const handleCancel = () => {
    setNewSrc(src);
    setPreviewSrc(src);
    setIsEditing(false);
    setError('');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewSrc(url);
    
    if (url && validateImageUrl(url)) {
      setPreviewSrc(url);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image file must be smaller than 5MB');
      return;
    }

    setIsLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewSrc(result);
      setPreviewSrc(result);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError('Failed to read the image file');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  if (isEditing) {
    return (
      <div className="relative group">
        <div className={`${aspectClasses[aspectRatio]} overflow-hidden rounded-lg border-2 ${error ? 'border-red-300' : 'border-blue-300'}`}>
          <img 
            src={previewSrc} 
            alt={alt}
            className={`w-full h-full object-cover ${className}`}
            onError={() => setError('Failed to load image from URL')}
          />
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL:
            </label>
            <input
              type="url"
              value={newSrc}
              onChange={handleUrlChange}
              className={`w-full border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md p-2 text-sm`}
              placeholder="Enter image URL (https://...)"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or upload a file:
            </label>
            <div className="flex items-center space-x-2">
              <label className={`bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="h-4 w-4" />
                <span>{isLoading ? 'Processing...' : 'Choose File'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              <span className="text-xs text-gray-500">Max 5MB</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={!!error || isLoading}
              className={`px-4 py-2 rounded transition-colors flex items-center space-x-2 ${
                error || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className={`${aspectClasses[aspectRatio]} overflow-hidden rounded-lg`}>
        <img 
          src={src} 
          alt={alt}
          className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${className}`}
          onClick={() => setIsEditing(true)}
        />
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Change image"
      >
        <Camera className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EditableImage;