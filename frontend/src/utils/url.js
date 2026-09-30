/**
 * Resolves the backend base URL dynamically from environment variables
 */
export const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return 'https://nestcares-in.onrender.com';
};

/**
 * Resolves relative image or upload URLs to absolute URLs
 */
export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const backend = getBackendUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backend}${cleanPath}`;
};
