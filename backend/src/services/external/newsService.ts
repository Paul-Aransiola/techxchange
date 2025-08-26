import axios from 'axios';
import { NEWS_API_KEY, NEWS_API_BASE_URL, CACHE_DURATION_MINUTES } from '../../config';
import { NewsApiResponse, NewsArticle, NewsQuery, CachedNews } from '../../@types/news';
import logger from '../../utils/util/logger';

class NewsService {
  private cache = new Map<string, CachedNews>();
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = NEWS_API_KEY;
    this.baseUrl = NEWS_API_BASE_URL;
  }

  /**
   * Get tech-related news articles
   */
  async getTechNews(query: NewsQuery = {}): Promise<{
    articles: NewsArticle[];
    totalResults: number;
    cached: boolean;
    lastUpdated: string;
  }> {
    try {
      const cacheKey = this.generateCacheKey(query);
      const cached = this.getFromCache(cacheKey);

      if (cached) {
        logger.info('Serving tech news from cache');
        return {
          articles: cached.articles,
          totalResults: cached.totalResults,
          cached: true,
          lastUpdated: cached.lastUpdated.toISOString(),
        };
      }

      const defaultQuery: NewsQuery = {
        q: 'technology OR tech OR software OR hardware OR programming OR AI OR "artificial intelligence"',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        ...query
      };

      const response = await axios.get<NewsApiResponse>(
        `${this.baseUrl}/everything`,
        {
          params: {
            ...defaultQuery,
            apiKey: this.apiKey,
          },
          timeout: 10000, // 10 seconds timeout
        }
      );
      console.log(response.data)

      if (response.data.status !== 'ok') {
        throw new Error(`News API error: ${response.data.status}`);
      }

      // Filter out articles with null or placeholder content
      const filteredArticles = response.data.articles.filter(
        (article: NewsArticle) => 
          article.title && 
          article.title !== '[Removed]' &&
          article.description &&
          article.description !== '[Removed]'
      );

      const result = {
        articles: filteredArticles,
        totalResults: response.data.totalResults,
        lastUpdated: new Date(),
        expiresAt: new Date(Date.now() + CACHE_DURATION_MINUTES * 60 * 1000),
      };

      this.setCache(cacheKey, result);
      
      logger.info(`Fetched ${filteredArticles.length} tech news articles from external API`);

      return {
        articles: result.articles,
        totalResults: result.totalResults,
        cached: false,
        lastUpdated: result.lastUpdated.toISOString(),
      };

    } catch (error) {
      logger.error('Error fetching tech news:', error);
      
      // Return cached data if available, even if expired
      const cacheKey = this.generateCacheKey(query);
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        logger.warn('Returning expired cached data due to API error');
        return {
          articles: cached.articles,
          totalResults: cached.totalResults,
          cached: true,
          lastUpdated: cached.lastUpdated.toISOString(),
        };
      }
      
      throw error;
    }
  }

  /**
   * Get top technology headlines
   */
  async getTechHeadlines(country: string = 'us'): Promise<{
    articles: NewsArticle[];
    totalResults: number;
    cached: boolean;
    lastUpdated: string;
  }> {
    try {
      const cacheKey = `headlines_${country}`;
      const cached = this.getFromCache(cacheKey);

      if (cached) {
        logger.info('Serving tech headlines from cache');
        return {
          articles: cached.articles,
          totalResults: cached.totalResults,
          cached: true,
          lastUpdated: cached.lastUpdated.toISOString(),
        };
      }

      const response = await axios.get<NewsApiResponse>(
        `${this.baseUrl}/top-headlines`,
        {
          params: {
            category: 'technology',
            country,
            apiKey: this.apiKey,
            pageSize: 20,
          },
          timeout: 10000,
        }
      );

      if (response.data.status !== 'ok') {
        throw new Error(`News API error: ${response.data.status}`);
      }

      const result = {
        articles: response.data.articles,
        totalResults: response.data.totalResults,
        lastUpdated: new Date(),
        expiresAt: new Date(Date.now() + CACHE_DURATION_MINUTES * 60 * 1000),
      };

      this.setCache(cacheKey, result);
      
      logger.info(`Fetched ${response.data.articles.length} tech headlines from external API`);

      return {
        articles: result.articles,
        totalResults: result.totalResults,
        cached: false,
        lastUpdated: result.lastUpdated.toISOString(),
      };

    } catch (error) {
      logger.error('Error fetching tech headlines:', error);
      
      const cacheKey = `headlines_${country}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        logger.warn('Returning expired cached headlines due to API error');
        return {
          articles: cached.articles,
          totalResults: cached.totalResults,
          cached: true,
          lastUpdated: cached.lastUpdated.toISOString(),
        };
      }
      
      throw error;
    }
  }

  /**
   * Search news by specific tech topics
   */
  async searchTechNews(searchTerm: string, options: Partial<NewsQuery> = {}): Promise<{
    articles: NewsArticle[];
    totalResults: number;
    cached: boolean;
    lastUpdated: string;
  }> {
    const query: NewsQuery = {
      q: `${searchTerm} AND (technology OR tech OR software OR hardware)`,
      sortBy: 'relevancy',
      pageSize: 15,
      ...options
    };

    return this.getTechNews(query);
  }

  /**
   * Get news from specific tech sources
   */
  async getNewsFromTechSources(): Promise<{
    articles: NewsArticle[];
    totalResults: number;
    cached: boolean;
    lastUpdated: string;
  }> {
    const techSources = [
      'techcrunch',
      'the-verge',
      'wired',
      'ars-technica',
      'engadget',
      'recode',
      'hacker-news'
    ].join(',');

    const query: NewsQuery = {
      sources: techSources,
      sortBy: 'publishedAt',
      pageSize: 20
    };

    return this.getTechNews(query);
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = new Date();
    let clearedCount = 0;

    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt <= now) {
        this.cache.delete(key);
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      logger.info(`Cleared ${clearedCount} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalEntries: number;
    expiredEntries: number;
    validEntries: number;
  } {
    const now = new Date();
    let expiredCount = 0;
    let validCount = 0;

    for (const value of this.cache.values()) {
      if (value.expiresAt <= now) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      validEntries: validCount,
    };
  }

  private generateCacheKey(query: NewsQuery): string {
    return `news_${JSON.stringify(query)}`;
  }

  private getFromCache(key: string): CachedNews | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = new Date();
    if (cached.expiresAt <= now) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  private setCache(key: string, data: CachedNews): void {
    // Limit cache size to prevent memory issues
    if (this.cache.size >= 100) {
      this.clearExpiredCache();
      
      // If still too many entries, remove oldest ones
      if (this.cache.size >= 100) {
        const oldestKeys = Array.from(this.cache.keys()).slice(0, 20);
        oldestKeys.forEach(k => this.cache.delete(k));
      }
    }

    this.cache.set(key, data);
  }
}

export default new NewsService();
