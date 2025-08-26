import axios from 'axios';
import { getAuthToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: {
    articles: NewsArticle[];
    totalResults: number;
    cached: boolean;
    lastUpdated: string;
  };
}

export interface NewsQuery {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  country?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token for protected endpoints
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// News API services
export const newsService = {
  /**
   * Get general tech news
   */
  getTechNews: async (params?: NewsQuery): Promise<NewsResponse> => {
    const response = await api.get('/news/tech', { params });
    return response.data;
  },

  /**
   * Get tech headlines by country
   */
  getTechHeadlines: async (country: string = 'us'): Promise<NewsResponse> => {
    const response = await api.get('/news/headlines', { params: { country } });
    return response.data;
  },

  /**
   * Search tech news by keyword
   */
  searchTechNews: async (searchQuery: string, params?: Omit<NewsQuery, 'q'>): Promise<NewsResponse> => {
    const response = await api.get('/news/search', { 
      params: { q: searchQuery, ...params } 
    });
    return response.data;
  },

  /**
   * Get news from popular tech sources
   */
  getNewsFromTechSources: async (): Promise<NewsResponse> => {
    const response = await api.get('/news/sources');
    return response.data;
  },

  /**
   * Get cache statistics (admin only)
   */
  getCacheStats: async (): Promise<any> => {
    const response = await api.get('/news/cache/stats');
    return response.data;
  },

  /**
   * Clear expired cache (admin only)
   */
  clearExpiredCache: async (): Promise<any> => {
    const response = await api.post('/news/cache/clear');
    return response.data;
  }
};

export default newsService;
