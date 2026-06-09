const BACKEND_URL = 'http://localhost:5000';

export const getImageUrl = (url) => {
  if (!url) return '/assets/products/placeholder.png';
  
  // If it's already an absolute URL (like a direct external image), return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it starts with a slash, prepend the backend URL
  if (url.startsWith('/')) {
    return `${BACKEND_URL}${url}`;
  }
  
  // Otherwise, prepend the backend URL with a slash
  return `${BACKEND_URL}/${url}`;
};
