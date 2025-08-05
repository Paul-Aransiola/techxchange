import { Router } from 'express';
import { getProducts, getProduct } from '../controllers/product';
import authRouter from './authentication';
import sellerRouter from './seller';

const router = Router();

// Product routes
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// Seller routes
router.use('/sellers', sellerRouter);

// just add below new parent route
router.use('/auth', authRouter);

export default router;