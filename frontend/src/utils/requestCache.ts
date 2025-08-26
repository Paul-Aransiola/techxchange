// Simple request cache to prevent duplicate API calls
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number; promise?: Promise<any> }>();
  private readonly defaultTTL = 30000; // 30 seconds

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // If we have a valid cached result, return it
    if (cached && now - cached.timestamp < ttl) {
      return cached.data;
    }

    // If there's an in-flight request, wait for it
    if (cached?.promise) {
      return cached.promise;
    }

    // Create new request
    const promise = fetcher();
    
    // Store the promise immediately to prevent duplicate requests
    this.cache.set(key, {
      data: null,
      timestamp: now,
      promise
    });

    try {
      const data = await promise;
      
      // Store the result
      this.cache.set(key, {
        data,
        timestamp: now
      });

      return data;
    } catch (error) {
      // Remove failed request from cache
      this.cache.delete(key);
      throw error;
    }
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.defaultTTL) {
        this.cache.delete(key);
      }
    }
  }
}

export const requestCache = new RequestCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  requestCache.cleanup();
}, 5 * 60 * 1000);
