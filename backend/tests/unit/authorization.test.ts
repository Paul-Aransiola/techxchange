import { Request, Response, NextFunction } from 'express';
import { authorizeMiddleware } from '../../src/middlewares/auth/authorization';
import { ROLES } from '../../src/utils/util/constants';
import * as cryptography from '../../src/utils/util/cryptography';
import { userModel } from '../../src/database/models';

// Mock dependencies
jest.mock('../../src/utils/util/cryptography');
jest.mock('../../src/database/models');
jest.mock('../../src/utils/util/logger');

const mockedCryptography = require('../../src/utils/util/cryptography');
const mockedUserModel = userModel as jest.Mocked<typeof userModel>;

describe('Authorization Middleware', () => {
  let mockReq: Partial<Request & { user?: any }>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      path: '/test',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authorizeMiddleware', () => {
    it('should reject request without authorization header', async () => {
      const middleware = authorizeMiddleware([ROLES.BUYER]);
      
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authorization token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token format', async () => {
      mockReq.headers = { authorization: 'InvalidToken' };
      const middleware = authorizeMiddleware([ROLES.BUYER]);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authorization token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle token decryption error', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      mockedCryptography.decrypt = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });
      const middleware = authorizeMiddleware([ROLES.BUYER]);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject when user not found or insufficient permissions', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockedCryptography.decrypt = jest.fn().mockReturnValue({
        data: { id: 'user123', role: ROLES.BUYER }
      });
      mockedUserModel.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      }) as any;
      const middleware = authorizeMiddleware([ROLES.BUYER]);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should successfully authorize valid user', async () => {
      const mockUser = { _id: 'user123', role: ROLES.BUYER };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockedCryptography.decrypt = jest.fn().mockReturnValue({
        data: { id: 'user123', role: ROLES.BUYER }
      });
      mockedUserModel.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUser)
      }) as any;
      const middleware = authorizeMiddleware([ROLES.BUYER]);

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual({
        id: 'user123',
        role: ROLES.BUYER,
      });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
