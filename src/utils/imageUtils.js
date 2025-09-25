// Simple utility to handle image URLs - now supports direct Cloudinary URLs
const getImageUrl = (filename) => {
  // If filename is already a full URL (Cloudinary or other external), return it as is
  if (filename && (filename.startsWith('http://') || filename.startsWith('https://'))) {
    return filename;
  }
  
  // If no filename provided, return empty string
  if (!filename) {
    return '';
  }
  
  // For any other case, return the filename as is (shouldn't happen with new Cloudinary setup)
  return filename;
};

// Export the utility function for use in React components
export { getImageUrl };
