import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// This is the interceptor
// It runs before every request is sent from the frontend
API.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem("token");
    
    // 2. If the token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Return the modified config
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default API;