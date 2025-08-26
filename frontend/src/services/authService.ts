// services/authService.ts
import axios from 'axios';
import { RegisterInput, LoginInput, AuthResponse, ROLES, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export const register = async (data: RegisterInput, role: ROLES): Promise<AuthResponse> => {
  const endpoint = role === ROLES.SELLER ? '/seller/sign-up' : '/buyer/sign-up';
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth${endpoint}`, data);
  return response.data;
};

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await axios.post<ApiResponse<AuthResponse>>(
    `${API_BASE_URL}/auth/sign-in`, 
    data
  );
  return response.data.data;
};

// Store token in localStorage
export const storeAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
  // Set default authorization header for axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
  // Remove authorization header from axios
  delete axios.defaults.headers.common['Authorization'];
};

// Initialize axios with auth token if exists
const token = getAuthToken();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}