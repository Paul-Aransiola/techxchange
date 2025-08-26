import { Router } from 'express';
import { healthController } from '../controllers/healthController';

const healthRouter = Router();

/**
 * @route GET /api/v1/health
 * @desc Health check endpoint
 * @access Public
 */
healthRouter.get('/', healthController.healthCheck);

/**
 * @route GET /api/v1/health/ready
 * @desc Readiness check endpoint
 * @access Public
 */
healthRouter.get('/ready', healthController.readinessCheck);

/**
 * @route GET /api/v1/health/metrics
 * @desc Metrics endpoint
 * @access Public
 */
healthRouter.get('/metrics', healthController.metrics);

export default healthRouter;
