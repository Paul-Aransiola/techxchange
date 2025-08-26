// src/services/buyerService.ts
import axios from 'axios';
import { Review, SellerProduct, Seller, ReviewInput, ProductReview } from '../types/seller';
import { getAuthToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface SellerFilters extends PaginationParams {
  search?: string;
}

export interface ReviewFilters extends PaginationParams {
  search?: string;
  minRating?: number;
  maxRating?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    products?: T[];
    sellers?: T[];
    reviews?: T[];
    totalProducts?: number;
    totalSellers?: number;
    totalReviews?: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    averageRating?: number;
  };
}

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

  export const getProducts = async (filters?: ProductFilters): Promise<PaginatedResponse<SellerProduct>> => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  };
  
  export const getSellers = async (filters?: SellerFilters): Promise<PaginatedResponse<Seller>> => {
    const response = await api.get('/sellers', { params: filters });
    return response.data;
  };

  export const createReview = async (productId: string, reviewData: ReviewInput): Promise<void> => {
    const response =  await api.post(`/products/${productId}/reviews`, reviewData);
    console.log('Review created:', response.data);
  };

  export const getAllReviews = async (): Promise<Review[]> => {
    const response = await api.get('/products/reviews');
    return response.data.data;
  };

  export const getProductReviews = async (
    productId: string, 
    filters?: ReviewFilters
  ): Promise<PaginatedResponse<ProductReview>> => {
    const response = await api.get(`/products/${productId}/reviews`, { params: filters });
    return response.data;
  };