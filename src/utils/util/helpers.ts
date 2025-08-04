import crypto from 'crypto';

import { hash } from 'bcrypt';

import { userModel } from '../../database/models';
import { UserModelInterface } from '../../@types/model';

import { encrypt } from './cryptography';


export const isDateExpired = (date: Date): boolean => {
  const now = new Date();
  const expirationTime = new Date(date);
  expirationTime.setMinutes(expirationTime.getMinutes() + 2);
  return now > expirationTime ? true : false
};

// Generate a random string of a given length from a set of allowed characters
const getRandomString = (length: number, allowedChars: string): string => {
  let result = '';
  const charsLength = allowedChars.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charsLength);
    result += allowedChars[randomIndex];
  }
  return result;
};

export const uniqueNumberGenerator = (length = 5, allowedChars = '0123456789'): string => {
  const unique = getRandomString(length, allowedChars);
  return unique;
};

export const generatePassword = (password: string, saltRound: number = 10) => {
  return hash(password, saltRound);
};

export const generateOTP = async () => {
  return uniqueNumberGenerator(parseInt(process.env.OTP_LENGTH || '5'));
};


// Helper to check for existing user by email or phone
export const checkUserPhoneOrEmailExistence = async (email: string, phoneNumber: string) => {
  const userExist = await userModel
    .findOne({
      $or: [{ email }, { phoneNumber }]
    })
    .lean();
  const { email: emailExist, phoneNumber: phoneNumberExist } = (userExist || {}) as UserModelInterface

  return emailExist || phoneNumberExist ? true : false
};



type TokenDuration = `${number}${'ms'|'s'|'m'|'h'|'d'|'y'}`;

export const generateUserToken = (
  userId: string, 
  role: string, 
  expiresIn: TokenDuration | number = (process.env.TOKEN_LIFE_SPAN as TokenDuration) || '120h'
): string => {
  // Validate inputs
  if (!userId || !role) {
    throw new Error('userId and role are required');
  }

  // Validate token duration format if it's a string
  if (typeof expiresIn === 'string' && !/^\d+(ms|s|m|h|d|y)$/.test(expiresIn)) {
    throw new Error('Invalid token duration format. Use format like "120h", "7d", etc.');
  }

  return encrypt({ 
    data: { 
      id: userId, 
      role,
      iat: Math.floor(Date.now() / 1000)
    }, 
    expiresIn 
  });
};