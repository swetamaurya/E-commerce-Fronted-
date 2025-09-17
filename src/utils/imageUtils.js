import { BASE_URL } from '../config';

// Instead of using admin backend directly
const getImageUrl = (filename) => {
  // If filename is already a proxy URL, return it as is
  if (filename && filename.includes('/api/images/proxy/')) {
    return filename;
  }
  
  // Check if this is an external URL (starts with http:// or https://)
  const isExternalUrl = filename && (filename.startsWith('http://') || filename.startsWith('https://'));
  
  if (isExternalUrl) {
    // For external URLs, encode them and pass through the proxy
    const encodedUrl = encodeURIComponent(filename);
    return `${BASE_URL}/api/images/proxy/${encodedUrl}`;
  } else {
    // For local admin backend images
    // Keep the filename as is - the backend will handle uploads/ prefix
    return `${BASE_URL}/api/images/proxy/${filename}`;
  }
};

// Export the utility function for use in React components
export { getImageUrl };
