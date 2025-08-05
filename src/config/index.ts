import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sisterMagret:icui4cu2go@cluster0.n95er.mongodb.net';
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'techxchange';
export const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb+srv://sisterMagret:<db_password>@cluster0.n95er.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
export const JWT_SECRET = process.env.JWT_SECRET || "80rfj0er09qruvjh90er9"



