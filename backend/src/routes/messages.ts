import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import globalValidationMiddleware from '../middlewares/globalValidation';
import Joi from 'joi';
import { ROLES } from '../utils/util/constants';

const router = Router();

// Validation schemas
const sendMessageSchema = Joi.object({
  receiverEmail: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Receiver email is required',
  }),
  subject: Joi.string().min(1).max(200).required().messages({
    'string.min': 'Subject must be at least 1 character',
    'string.max': 'Subject must not exceed 200 characters',
    'any.required': 'Subject is required',
  }),
  content: Joi.string().min(1).max(2000).required().messages({
    'string.min': 'Content must be at least 1 character',
    'string.max': 'Content must not exceed 2000 characters',
    'any.required': 'Content is required',
  }),
  productId: Joi.string().optional(),
});

// Authentication middleware for all routes
const authenticate = authorizeMiddleware([ROLES.BUYER, ROLES.SELLER]);

// Routes
router.post(
  '/',
  authenticate,
  globalValidationMiddleware.inputMiddleware(sendMessageSchema),
  messageController.sendMessage
);

router.get(
  '/',
  authenticate,
  messageController.getMessages
);

router.get(
  '/unread-count',
  authenticate,
  messageController.getUnreadCount
);

router.patch(
  '/:messageId/read',
  authenticate,
  messageController.markMessageAsRead
);

router.delete(
  '/:messageId',
  authenticate,
  messageController.deleteMessage
);

export default router;
