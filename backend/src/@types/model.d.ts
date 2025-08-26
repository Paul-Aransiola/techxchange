import mongoose, { Document } from 'mongoose';

import { ROLES, OTP_TYPE, OTP_STATUS } from '../utils/util/constants';

export interface UserModelInterface {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: ROLES;
  password: string;
  isVerified: boolean;
  lastLogin: Date;
  __v?: number;
  verifyPassword?: (password: string) => Promise<boolean>;
}


export interface AddressInterface {
  location?: string;
  city?: string;
  state?: string;
}

export interface SellerModelInterface extends Document {
  _id: mongoose.Type.ObjectId;
  user?: mongoose.Types.ObjectId;
  address?: AddressInterface;
  bankDetails?: BankDetailsInterface;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

export interface BankDetailsInterface {
    bankCode?: string
    bankName?: string
    accountNumber?: string
    accountName?: string
}

export interface ProductModelInterFace {
  _id: mongoose.Type.ObjectId;
  name: string;
  description: string;
  category: string;
  price: number;
  images?: string[];
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;

}


export interface ReviewModelInterface {
    _id: mongoose.Type.ObjectId;
    text: string;
    rating: number;
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v?: number;

}