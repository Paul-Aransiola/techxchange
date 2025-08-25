import { Router } from 'express';
import { newsController } from '../controllers/external/newsController';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import { ROLES } from '../utils/util/constants';

const newsRouter = Router();

/**
 * @route GET /api/v1/news/tech
 * @desc Get general tech news
 * @access Public
 */
newsRouter.get('/tech', newsController.getTechNews);

/**
 * @route GET /api/v1/news/headlines
 * @desc Get tech headlines
 * @access Public
 */
newsRouter.get('/headlines', newsController.getTechHeadlines);

/**
 * @route GET /api/v1/news/search
 * @desc Search tech news by keyword
 * @access Public
 */
newsRouter.get('/search', newsController.searchTechNews);

/**
 * @route GET /api/v1/news/sources
 * @desc Get news from popular tech sources
 * @access Public
 */
newsRouter.get('/sources', newsController.getNewsFromTechSources);

/**
 * @route GET /api/v1/news/cache/stats
 * @desc Get cache statistics (for monitoring)
 * @access Private (Admin only)
 */
newsRouter.get(
  '/cache/stats',
  authorizeMiddleware([ROLES.ADMIN]),
  newsController.getCacheStats
);

/**
 * @route POST /api/v1/news/cache/clear
 * @desc Clear expired cache entries
 * @access Private (Admin only)
 */
newsRouter.post(
  '/cache/clear',
  authorizeMiddleware([ROLES.ADMIN]),
  newsController.clearExpiredCache
);

export default newsRouter;
