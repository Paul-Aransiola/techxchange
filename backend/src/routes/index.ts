import { Router } from 'express';
import ProductRouter from './product';
import authRouter from './authentication';
import sellerRouter from './seller';
import newsRouter from './news';


const router = Router();

// Product routes
router.use('/products', ProductRouter);

// Seller routes
router.use('/sellers', sellerRouter);

// Authentication routes
router.use('/auth', authRouter);

// News routes
router.use('/news', newsRouter);

export default router;