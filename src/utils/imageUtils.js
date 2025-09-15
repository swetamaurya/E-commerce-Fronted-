import { BASE_URL } from '../config';

// Utility function to get full image URL
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) {
    return `${BASE_URL}${url}`;

    
  }
  return url;
};
