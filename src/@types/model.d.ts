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


export interface SellerModelInterface extends Document {
  _id: mongoose.Type.ObjectId;
  name: string;
  location: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface AddressInterface {
  place?: string;
  latitude?: string;
  longitude?: string;
}

export interface BankDetailsInterface {
    bankCode?: string
    bankName?: string
    accountNumber?: string
    accountName?: string
}

