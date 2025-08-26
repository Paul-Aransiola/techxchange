import { Router } from 'express';
import { newsController } from '../controllers/external/newsController';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import { ROLES } from '../utils/util/constants';
import { newsLimiter, adminLimiter } from '../middlewares/rateLimiter';

const newsRouter = Router();

// Apply news rate limiting to public news routes
newsRouter.get('/tech', newsLimiter, newsController.getTechNews);
newsRouter.get('/headlines', newsLimiter, newsController.getTechHeadlines);
newsRouter.get('/search', newsLimiter, newsController.searchTechNews);
newsRouter.get('/sources', newsLimiter, newsController.getNewsFromTechSources);

// Admin routes with rate limiting
newsRouter.get(
  '/cache/stats',
  adminLimiter,
  authorizeMiddleware([ROLES.ADMIN]),
  newsController.getCacheStats
);

newsRouter.post(
  '/cache/clear',
  adminLimiter,
  authorizeMiddleware([ROLES.ADMIN]),
  newsController.clearExpiredCache
);

export default newsRouter;
