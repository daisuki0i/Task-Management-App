import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_END_POINT;
const axiosInstance = axios.create({ baseURL: API_URL });

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Check if token exists (indicating a possible expiration rather than no login)
      const token = localStorage.getItem('token');
      if (token) {
        // Token exists but resulted in 401 - likely expired
        toast.error('Your session has expired. Please login again.');
        // Clear the token
        localStorage.removeItem('token');
        // Redirect to login page after a short delay (to allow toast to be seen)
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    }
    
    // Return the error for further processing
    return Promise.reject(error);
  }
);

export default axiosInstance;
