import axios from 'axios';
import { getAuthToken } from './authService';
import { SellerProduct } from '../types/seller';
import { requestCache } from '../utils/requestCache';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface CartItem {
  product: SellerProduct;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCart = async (): Promise<{ cart: Cart }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token');
  }

  return requestCache.get(
    `cart_${token}`,
    async () => {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    },
    15000 // 15 seconds cache for cart data
  );
};

export const addToCart = async (data: AddToCartRequest) => {
  const token = getAuthToken();
  if (token) {
    requestCache.clear(`cart_${token}`); // Clear cache when modifying cart
  }
  
  const response = await axios.post(`${API_BASE_URL}/cart/add`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateCartItem = async (productId: string, data: UpdateCartItemRequest) => {
  const token = getAuthToken();
  if (token) {
    requestCache.clear(`cart_${token}`); // Clear cache when modifying cart
  }
  
  const response = await axios.put(`${API_BASE_URL}/cart/item/${productId}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  const token = getAuthToken();
  if (token) {
    requestCache.clear(`cart_${token}`); // Clear cache when modifying cart
  }
  
  const response = await axios.delete(`${API_BASE_URL}/cart/item/${productId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const clearCart = async () => {
  const token = getAuthToken();
  if (token) {
    requestCache.clear(`cart_${token}`); // Clear cache when clearing cart
  }
  
  const response = await axios.delete(`${API_BASE_URL}/cart/clear`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
