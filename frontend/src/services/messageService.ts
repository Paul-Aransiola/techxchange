import axios from 'axios';
import { getAuthToken } from './authService';
import { requestCache } from '../utils/requestCache';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  product?: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  subject: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  receiverEmail: string;
  subject: string;
  content: string;
  productId?: string;
}

export interface MessagesResponse {
  messages: Message[];
  totalMessages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const sendMessage = async (data: SendMessageRequest) => {
  const token = getAuthToken();
  if (token) {
    requestCache.clear(`messages_${token}`); // Clear cache when sending message
  }
  
  const response = await axios.post(`${API_BASE_URL}/messages`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getMessages = async (page = 1, limit = 20, type: 'all' | 'sent' | 'received' = 'all') => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token');
  }

  return requestCache.get(
    `messages_${token}_${page}_${limit}_${type}`,
    async () => {
      const response = await axios.get(`${API_BASE_URL}/messages?page=${page}&limit=${limit}&type=${type}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    20000 // 20 seconds cache for messages
  );
};

export const markAsRead = async (messageId: string) => {
  const token = getAuthToken();
  if (token) {
    requestCache.clear(`messages_${token}`); // Clear cache when marking as read
  }
  
  const response = await axios.put(`${API_BASE_URL}/messages/${messageId}/read`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteMessage = async (messageId: string) => {
  const token = getAuthToken();
  if (token) {
    requestCache.clear(`messages_${token}`); // Clear cache when deleting
  }
  
  const response = await axios.delete(`${API_BASE_URL}/messages/${messageId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await axios.get(`${API_BASE_URL}/messages/unread-count`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
};
