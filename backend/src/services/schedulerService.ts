import cron from 'node-cron';
import newsService from '../services/external/newsService';
import logger from '../utils/util/logger';

class SchedulerService {
  /**
   * Initialize all scheduled tasks
   */
  init(): void {
    this.scheduleCacheCleaning();
    logger.info('Scheduler service initialized');
  }

  /**
   * Schedule cache cleaning every 30 minutes
   */
  private scheduleCacheCleaning(): void {
    // Run every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      try {
        logger.info('Running scheduled cache cleanup');
        newsService.clearExpiredCache();
      } catch (error) {
        logger.error('Error during scheduled cache cleanup:', error);
      }
    });

    logger.info('Cache cleaning scheduled to run every 30 minutes');
  }
}

export default new SchedulerService();
