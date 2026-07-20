/**
 * Resolves the backend base URL dynamically from environment variables
 */
export const getBackendUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://nestcares-in.onrender.com/api';
  // Strip trailing '/api' or '/api/' to get the base backend server URL
  return apiUrl.replace(/\/api\/?$/, '');
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
