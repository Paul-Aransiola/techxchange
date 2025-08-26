import { Request, Response, NextFunction } from 'express';
import authenticationController from '../../src/controllers/authController';
import { healthCheck, readinessCheck, metrics } from '../../src/controllers/healthController';
import { authenticationService } from '../../src/services/auth';

// Mock services
jest.mock('../../src/services/auth');

const mockAuthService = authenticationService as jest.Mocked<typeof authenticationService>;
const { userRegistrationHandler, userSignInHandler } = authenticationController;

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 'user123', role: 'BUYER' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('userRegistrationHandler', () => {
    it('should register user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phoneNumber: '+123456789012',
        role: 'BUYER'
      };
      const registeredUser = { _id: 'user123', ...userData };
      const token = 'jwt-token';

      mockReq.body = userData;
      mockAuthService.registerUser = jest.fn().mockResolvedValue({ user: registeredUser, token });

      await userRegistrationHandler(mockReq as Request, mockRes as Response);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Registration successful.',
        data: { user: registeredUser, token }
      });
    });

    it('should handle registration errors', async () => {
      const error = new Error('Registration failed');
      mockReq.body = { email: 'john@example.com' };
      mockAuthService.registerUser = jest.fn().mockRejectedValue(error);

      await userRegistrationHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Registering user failed',
        error: 'Registration failed'
      });
    });
  });

  describe('userSignInHandler', () => {
    it('should sign in user successfully', async () => {
      const signInData = { email: 'john@example.com', password: 'password123' };
      const user = { _id: 'user123', email: 'john@example.com' };
      const token = 'jwt-token';

      mockReq.body = signInData;
      mockAuthService.signInUser = jest.fn().mockResolvedValue({ user, token });

      await userSignInHandler(mockReq as Request, mockRes as Response);

      expect(mockAuthService.signInUser).toHaveBeenCalledWith(signInData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Sign in complete.',
        data: { user, token }
      });
    });

    it('should handle sign-in errors', async () => {
      const error = new Error('Invalid credentials');
      mockReq.body = { email: 'john@example.com', password: 'wrong' };
      mockAuthService.signInUser = jest.fn().mockRejectedValue(error);

      await userSignInHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Sign in attempt failed',
        error: 'Invalid credentials'
      });
    });
  });

  describe('healthController', () => {
    beforeEach(() => {
      mockReq = {
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('test-agent')
      };
    });

    it('should return health status', () => {
      healthCheck(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Service is healthy',
          data: expect.objectContaining({
            status: 'OK',
            uptime: expect.any(Number),
            timestamp: expect.any(String)
          })
        })
      );
    });

    it('should return readiness status when service is ready', () => {
      // Mock memory usage to be below threshold
      const originalMemoryUsage = process.memoryUsage;
      process.memoryUsage = jest.fn().mockReturnValue({
        rss: 100 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        heapUsed: 100 * 1024 * 1024, // Below 500MB threshold
        external: 0,
        arrayBuffers: 0
      }) as any;

      readinessCheck(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Service is ready',
          data: expect.objectContaining({
            checks: expect.any(Object)
          })
        })
      );

      // Restore original function
      process.memoryUsage = originalMemoryUsage;
    });

    it('should return metrics', () => {
      metrics(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Metrics retrieved successfully',
          data: expect.objectContaining({
            uptime: expect.any(Number),
            memory: expect.any(Object),
            cpu: expect.any(Object),
            timestamp: expect.any(String)
          })
        })
      );
    });
  });
});
