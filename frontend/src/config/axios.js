import axios from 'axios';

// When using Vite's proxy, we use relative URLs
const BASE_URL = '/api';

console.log('Creating axios instance with base URL:', BASE_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.baseURL + config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
