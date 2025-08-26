import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sisterMagret:icui4cu2go@cluster0.n95er.mongodb.net';
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'techxchange';
export const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb+srv://sisterMagret:icui4cu2go@cluster0.n95er.mongodb.net';
export const JWT_SECRET = process.env.JWT_SECRET || "80rfj0er09qruvjh90er9"

// External API Configuration
export const NEWS_API_KEY = process.env.NEWS_API_KEY || '167f1d90ece445c8a41912e108b3445c';
export const NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';

// Cache Configuration
export const CACHE_DURATION_MINUTES = parseInt(process.env.CACHE_DURATION_MINUTES || '30');



