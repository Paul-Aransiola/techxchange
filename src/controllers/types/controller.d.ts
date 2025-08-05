import mongoose from 'mongoose';

import { SellerModelInterface, UserModelInterface } from '../../@types/model';


export type registerInputType = Pick<
  UserModelInterface,
  'email' | 'firstName' | 'lastName' | 'password' | 'phoneNumber' | 'role'
>;

export type signInInputType = Pick<
  UserModelInterface,
  'password' | 'email' 
>;


export type sellerBankDetailsInputType = Pick<
BankDetailsInterface,
'bankName' |
'bankCode' |
'accountNumber' |
'accountName'
>

export type sellerBioInputType = Pick<SellerModelInterface, 'address' | 'bankDetails'>;

export type IdType = mongoose.Schema.Types.ObjectId;
