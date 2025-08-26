import { Request, Response } from 'express';
import logger from '../utils/util/logger';

/**
 * Health check endpoint for monitoring
 */
export const healthCheck = (req: Request, res: Response) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  };

  logger.info('Health check requested', { ip: req.ip, userAgent: req.get('User-Agent') });

  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    data: healthData
  });
};

/**
 * Readiness check for deployment
 */
export const readinessCheck = (req: Request, res: Response) => {
  // Check database connection and other dependencies
  const checks = {
    database: true, // You can add actual DB health check here
    externalAPIs: true, // Check news API availability
    memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024, // Less than 500MB
  };

  const isReady = Object.values(checks).every(check => check === true);

  if (isReady) {
    logger.info('Readiness check passed');
    res.status(200).json({
      success: true,
      message: 'Service is ready',
      data: { checks }
    });
  } else {
    logger.warn('Readiness check failed', { checks });
    res.status(503).json({
      success: false,
      message: 'Service is not ready',
      data: { checks }
    });
  }
};

/**
 * Metrics endpoint for monitoring
 */
export const metrics = (req: Request, res: Response) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  };

  logger.info('Metrics requested');

  res.status(200).json({
    success: true,
    message: 'Metrics retrieved successfully',
    data: metrics
  });
};

export const healthController = {
  healthCheck,
  readinessCheck,
  metrics
};
