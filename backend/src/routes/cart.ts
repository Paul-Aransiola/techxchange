import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import globalValidationMiddleware from '../middlewares/globalValidation';
import Joi from 'joi';
import { ROLES } from '../utils/util/constants';

const router = Router();

// Validation schemas
const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required',
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Quantity must be at least 1',
  }),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
});

// Authentication middleware for all routes
const authenticate = authorizeMiddleware([ROLES.BUYER, ROLES.SELLER]);

// Routes
router.get(
  '/',
  authenticate,
  cartController.getCart
);

router.post(
  '/add',
  authenticate,
  globalValidationMiddleware.inputMiddleware(addToCartSchema),
  cartController.addToCart
);

router.put(
  '/item/:productId',
  authenticate,
  globalValidationMiddleware.inputMiddleware(updateCartItemSchema),
  cartController.updateCartItem
);

router.delete(
  '/item/:productId',
  authenticate,
  cartController.removeFromCart
);

router.delete(
  '/clear',
  authenticate,
  cartController.clearCart
);

export default router;
