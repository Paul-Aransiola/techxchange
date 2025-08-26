import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    error: 'Authentication rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// News API rate limiting
export const newsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute for news endpoints
  message: {
    success: false,
    message: 'Too many news requests, please try again later.',
    error: 'News API rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Product creation rate limiting
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 creation requests per hour
  message: {
    success: false,
    message: 'Too many creation attempts, please try again later.',
    error: 'Creation rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin endpoints rate limiting (more lenient for admin users)
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs for admin endpoints
  message: {
    success: false,
    message: 'Admin rate limit exceeded, please try again later.',
    error: 'Admin rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  generalLimiter,
  authLimiter,
  newsLimiter,
  createLimiter,
  adminLimiter
};
