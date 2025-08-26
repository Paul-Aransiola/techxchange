// src/types/seller.ts
export interface Address {
    location?: string;
    city?: string;
    state?: string;
  }
  
  export interface BankDetails {
    bankCode?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  }
  
  export interface SellerProfile {
    _id: string;
    user: string;
    address?: Address;
    bankDetails?: BankDetails;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    images?: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export type ReviewInput = {
    text: string;
    rating: number;
  };
  
  export interface Review {
    _id: string;
    text: string;
    rating: number;
    user: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  }

  export interface SellerProduct {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    images?: string[];
    seller: {
      _id: string;
      user: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
      };
      address: {
        location?: string;
        city?: string;
        state?: string;
      };
    };
    averageRating?: number;
    reviews?: Review[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Seller {
    _id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    address?: {
      location?: string;
      city?: string;
      state?: string;
    };
    products?: Product[];
  }

  export interface ProductReview {
    _id: string;
    text: string;
    rating: number;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    product: {
      _id: string;
      name: string;
      category: string;
      price: number;
      seller: {
        _id: string;
        user: {
          firstName: string;
          lastName: string;
        };
      };
    };
    createdAt: string;
  }