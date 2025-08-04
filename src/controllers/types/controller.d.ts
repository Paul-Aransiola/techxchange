import mongoose from 'mongoose';

import { UserModelInterface } from '../../@types/model';


export type registerInputType = Pick<
  UserModelInterface,
  'email' | 'firstName' | 'lastName' | 'password' | 'phoneNumber' | 'role'
>;

export type verifyOTPInputType = {
  userId: string;
  otp: string;
  role: string;
}

export type signInInputType = Pick<
  UserModelInterface,
  'password' | 'email' 
>;

export type otpRequestInputType = Pick<
  UserModelInterface,
  'phoneNumber' 
>;

export type sellerBankDetailsInputType = Pick<
BankDetailsInterface,
'bankName' |
'bankCode' |
'accountNumber' |
'accountName'
>

export type sellerBioInputType = Pick<DriverModelInterface, 'dob' | 'address' | 'emergencyContact' | 'city' | 'state' | 'bankDetails'>;
export type vehicleDetailInputType = Pick<VehicleDetailModelInterface, 'plateNumber' | 'model' | 'year' | 'type' | 'doodle' | 'freightWeight' | 'vehicleLength' | 'vehicleWidth' | 'insuranceDocument'| 'picture' >;

export type IdType = mongoose.Schema.Types.ObjectId;
