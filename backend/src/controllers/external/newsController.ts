import { Request, Response } from 'express';
import newsService from '../../services/external/newsService';
import { sendResponse } from '../../utils/util/helpers';
import logger from '../../utils/util/logger';

class NewsController {
  /**
   * Get general tech news
   */
  async getTechNews(req: Request, res: Response): Promise<void> {
    try {
      const { q, page, pageSize, sortBy } = req.query;
      
      const query = {
        q: q as string,
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        sortBy: sortBy as 'relevancy' | 'popularity' | 'publishedAt' | undefined,
      };

      // Remove undefined values
      Object.keys(query).forEach(key => 
        query[key as keyof typeof query] === undefined && delete query[key as keyof typeof query]
      );

      const newsData = await newsService.getTechNews(query);
      
      sendResponse(res, 200, true, 'Tech news retrieved successfully', newsData);
    } catch (error) {
      logger.error('Error in getTechNews controller:', error);
      sendResponse(res, 500, false, 'Failed to fetch tech news', null, error);
    }
  }

  /**
   * Get tech headlines
   */
  async getTechHeadlines(req: Request, res: Response): Promise<void> {
    try {
      const { country = 'us' } = req.query;
      
      const newsData = await newsService.getTechHeadlines(country as string);
      
      sendResponse(res, 200, true, 'Tech headlines retrieved successfully', newsData);
    } catch (error) {
      logger.error('Error in getTechHeadlines controller:', error);
      sendResponse(res, 500, false, 'Failed to fetch tech headlines', null, error);
    }
  }

  /**
   * Search tech news by keyword
   */
  async searchTechNews(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        sendResponse(res, 400, false, 'Search query (q) is required', null);
        return;
      }

      const { page, pageSize, sortBy } = req.query;
      
      const options = {
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        sortBy: sortBy as 'relevancy' | 'popularity' | 'publishedAt' | undefined,
      };

      // Remove undefined values
      Object.keys(options).forEach(key => 
        options[key as keyof typeof options] === undefined && delete options[key as keyof typeof options]
      );

      const newsData = await newsService.searchTechNews(q, options);
      
      sendResponse(res, 200, true, `Search results for "${q}"`, newsData);
    } catch (error) {
      logger.error('Error in searchTechNews controller:', error);
      sendResponse(res, 500, false, 'Failed to search tech news', null, error);
    }
  }

  /**
   * Get news from tech sources
   */
  async getNewsFromTechSources(req: Request, res: Response): Promise<void> {
    try {
      const newsData = await newsService.getNewsFromTechSources();
      
      sendResponse(res, 200, true, 'News from tech sources retrieved successfully', newsData);
    } catch (error) {
      logger.error('Error in getNewsFromTechSources controller:', error);
      sendResponse(res, 500, false, 'Failed to fetch news from tech sources', null, error);
    }
  }

  /**
   * Get cache statistics (for debugging/monitoring)
   */
  async getCacheStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = newsService.getCacheStats();
      
      sendResponse(res, 200, true, 'Cache statistics retrieved successfully', stats);
    } catch (error) {
      logger.error('Error in getCacheStats controller:', error);
      sendResponse(res, 500, false, 'Failed to get cache statistics', null, error);
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(req: Request, res: Response): Promise<void> {
    try {
      newsService.clearExpiredCache();
      
      sendResponse(res, 200, true, 'Expired cache entries cleared successfully', null);
    } catch (error) {
      logger.error('Error in clearExpiredCache controller:', error);
      sendResponse(res, 500, false, 'Failed to clear expired cache', null, error);
    }
  }
}

export const newsController = new NewsController();
