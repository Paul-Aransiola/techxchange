import { healthCheck, readinessCheck, metrics } from '../../src/controllers/healthController';
import { Request, Response } from 'express';

describe('Health Controller Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-agent')
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      healthCheck(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Service is healthy',
        data: expect.objectContaining({
          status: 'OK',
          timestamp: expect.any(String),
          uptime: expect.any(Number),
          memory: expect.any(Object),
          environment: expect.any(String),
          version: expect.any(String)
        })
      });
    });
  });

  describe('readinessCheck', () => {
    it('should return readiness status when service is ready', () => {
      // Mock process.memoryUsage to return low memory usage
      const originalMemoryUsage = process.memoryUsage;
      (process as any).memoryUsage = jest.fn().mockReturnValue({
        rss: 100 * 1024 * 1024,
        heapTotal: 200 * 1024 * 1024,
        heapUsed: 100 * 1024 * 1024, // Less than 500MB threshold
        external: 10 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      readinessCheck(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Service is ready',
        data: { 
          checks: {
            database: true,
            externalAPIs: true,
            memory: true
          }
        }
      });

      // Restore original function
      process.memoryUsage = originalMemoryUsage;
    });
  });

  describe('metrics', () => {
    it('should return metrics', () => {
      metrics(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Metrics retrieved successfully',
        data: expect.objectContaining({
          timestamp: expect.any(String),
          uptime: expect.any(Number),
          memory: expect.any(Object),
          cpu: expect.any(Object)
        })
      });
    });
  });
});