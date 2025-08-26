import { Router } from 'express';
import ProductRouter from './product';
import authRouter from './authentication';
import sellerRouter from './seller';
import newsRouter from './news';
import healthRouter from './health';
import messageRouter from './messages';
import cartRouter from './cart';

const router = Router();

// Health check routes (should be first for monitoring)
router.use('/health', healthRouter);

// Product routes
router.use('/products', ProductRouter);

// Seller routes
router.use('/sellers', sellerRouter);

// Authentication routes
router.use('/auth', authRouter);

// News routes
router.use('/news', newsRouter);

// Message routes
router.use('/messages', messageRouter);

// Cart routes
router.use('/cart', cartRouter);

export default router;