// Image utility functions

/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path from database (e.g., '/uploads/123.jpg' or 'https://...')
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // If it's already a full URL (http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path starting with /uploads/
  if (imagePath.startsWith('/uploads/')) {
    const baseURL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseURL}${imagePath}`;
  }

  // If it's just a filename
  const baseURL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${baseURL}/uploads/${imagePath}`;
};

/**
 * Get multiple image URLs
 * @param {Array} images - Array of image paths
 * @returns {Array} - Array of full image URLs
 */
export const getImageUrls = (images) => {
  if (!images || !Array.isArray(images)) {
    return ['https://via.placeholder.com/400x300?text=No+Image'];
  }

  return images.map(img => getImageUrl(img));
};

/**
 * Handle image error by setting fallback
 * @param {Event} e - Error event
 */
export const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
  e.target.onerror = null; // Prevent infinite loop
};

export default {
  getImageUrl,
  getImageUrls,
  handleImageError
};
