// types/auth.ts
export enum ROLES {
    BUYER = 'buyer',
    SELLER = 'seller',
    ADMIN = 'admin',
  }
  
  export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: ROLES;
    isVerified: boolean;
    lastLogin?: Date;
  }
  
  export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: ROLES;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }

  
  export interface AuthResponse {
    token: string;
    user: User;
  }
