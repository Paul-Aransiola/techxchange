import { Router } from 'express';
import ProductRouter from './product';
import authRouter from './authentication';
import sellerRouter from './seller';


const router = Router();

// Product routes
router.use('/products', ProductRouter);

// Seller routes
router.use('/sellers', sellerRouter);

// just add below new parent route
router.use('/auth', authRouter);

export default router;