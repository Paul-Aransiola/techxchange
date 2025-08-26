import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import { notFoundHandler, errorHandler } from './middlewares/error';
import router from './routes';
import schedulerService from './services/schedulerService';
import { generalLimiter } from './middlewares/rateLimiter';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeScheduler();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      } : false, // Disable CSP in development to avoid cross-origin issues
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com', 'https://www.your-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    // Rate limiting
    this.app.use(generalLimiter);
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Serve static files (uploaded images) with proper CORS headers
    this.app.use('/uploads', cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com', 'https://www.your-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
      methods: ['GET', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      credentials: false
    }), (req, res, next) => {
      // Add additional headers for cross-origin image loading
      res.header('Cross-Origin-Resource-Policy', 'cross-origin');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    }, express.static(path.join(__dirname, '../uploads')));
    
    this.app.use('/api/v1', router);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeScheduler(): void {
    // Only initialize scheduler in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      schedulerService.init();
    }
  }
}

export default new App().app;