// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // Ya incluye /api
  withCredentials: true,
});

// Interceptor para requests
API.interceptors.request.use(
  (config) => {
    console.log('Request config:', config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
API.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    // Si es un error de autenticación, redirigir al login
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Error de autenticación detectado');
      // Aquí podrías redirigir al login si es necesario
    }
    
    return Promise.reject(error);
  }
);

export default API;