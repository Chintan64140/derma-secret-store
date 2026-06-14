const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://derma-secret-backend.onrender.com';

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
