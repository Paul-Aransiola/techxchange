import mongoose from 'mongoose';
import { NODE_ENV, MONGO_URI, MONGO_URI_TEST } from './index';

const DB_URI = NODE_ENV === 'test' ? MONGO_URI_TEST : MONGO_URI;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
};