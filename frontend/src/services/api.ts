import axios from 'axios';
import { API_URL } from '../config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const login = (credentials: { email: string; password: string }) => {
  const formData = new FormData();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  formData.append('grant_type', 'password');
  formData.append('client_id', 'client');
  formData.append('client_secret', 'secret');
  
  return api.post('/auth/oauth/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const register = (userData: { email: string; password: string; name: string }) =>
  api.post('/auth/register', userData);

export const getCustomerProfile = () =>
  api.get('/customer/profile');

export const updateCustomerProfile = (profileData: any) =>
  api.put('/customer/profile', profileData);

export const getOrders = () =>
  api.get('/order/orders');

export const getOrderById = (orderId: string) =>
  api.get(`/order/orders/${orderId}`);

export const createOrder = (orderData: any) =>
  api.post('/order/orders', orderData);

// Admin API
export const getAllUsers = () =>
  api.get('/admin/users');

export const getAllOrders = () =>
  api.get('/admin/orders');

export const updateOrderStatus = (orderId: string, status: string) =>
  api.put(`/admin/orders/${orderId}/status`, { status });

export default api; 