import axios from 'axios';

// Configure axios defaults for Laravel API
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add request interceptor to get fresh CSRF token before each request
axios.interceptors.request.use((config) => {
  const token = document.head.querySelector('meta[name="csrf-token"]');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = (token as HTMLMetaElement).content;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle 419 CSRF errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 419) {
      console.error('CSRF token mismatch. Please refresh the page.');
      // Optionally reload the page to get fresh token
      // window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axios;
