import { Router } from 'express';
import { getProducts, getProduct } from '../controllers/product';
import { getSellers, getSeller } from '../controllers/seller';

const router = Router();

// Product routes
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// Seller routes
router.get('/sellers', getSellers);
router.get('/sellers/:id', getSeller);

export default router;