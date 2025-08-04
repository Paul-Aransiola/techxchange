import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/techxchange';
export const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/techxchange_test';
export const JWT_SECRET = process.env.JWT_SECRET || "80rfj0er09qruvjh90er9"