// src/services/sellerService.ts
import axios from 'axios';
import { SellerProfile, Product, Review } from '../types/seller';
import { getAuthToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
  });
  
  // Add request interceptor to include auth token
  api.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  
  export const getSellerProfile = async (sellerId: number | string): Promise<SellerProfile> => {
    try {
  
      const idToFetch = sellerId;
      
      if (!idToFetch) {
        throw new Error('User ID is required');
      }
  
      const response = await api.get(`/sellers/${idToFetch}`);
    
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Please login to access seller profile');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch seller profile');
      }
      throw new Error('Network error occurred');
    }
  };
  
  export const updateSellerProfile = async (data: Partial<SellerProfile>): Promise<SellerProfile> => {
    const response = await api.put('/sellers', data);
    return response.data.data;
  };

  
  export const getSellerProducts = async (sellerId: number | string): Promise<Product[]> => {
    const response = await api.get(`/sellers/${sellerId}/products`);
    console.log('Seller products response:', response.data);
    return response.data.data.products; // Extract the products array from the nested data
  };

  // Get authenticated seller's own products
  export const getMyProducts = async (): Promise<Product[]> => {
    const response = await api.get('/sellers/products');
    console.log('My products response:', response.data);
    return response.data.data.products; // Extract the products array from the nested data
  };
  
  export const createProduct = async (
    productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> & { images?: File[] }
  ): Promise<Product> => {
    const formData = new FormData();
    
    // Add product data
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('price', productData.price.toString());
    
    // Add image files
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  };
  
  export const updateProduct = async (
    id: string, 
    productData: Partial<Product> & { images?: File[] }
  ): Promise<Product> => {
    const formData = new FormData();
    
    // Add product data
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.category) formData.append('category', productData.category);
    if (productData.price) formData.append('price', productData.price.toString());
    
    // Add image files if provided
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  };
  
  export const getProductReviews = async (productId: string): Promise<Review[]> => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data.data;
  };
