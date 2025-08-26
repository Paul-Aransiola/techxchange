import { Request, Response, NextFunction } from 'express';
import globalValidationMiddleware from '../../src/middlewares/globalValidation';
import { errorHandler } from '../../src/middlewares/error';
import { assignRoleMiddleware } from '../../src/middlewares/assignRoleMiddleware';
import { ROLES } from '../../src/utils/util/constants';
import Joi from 'joi';

describe('Middleware Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('globalValidation', () => {
    const testSchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(0).required()
    });

    it('should pass validation with valid data', () => {
      mockReq.body = { name: 'John', age: 25 };

      const middleware = globalValidationMiddleware.inputMiddleware(testSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid data', () => {
      mockReq.body = { name: '', age: -5 };

      const middleware = globalValidationMiddleware.inputMiddleware(testSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        error: expect.any(Object)
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with missing required fields', () => {
      mockReq.body = {};

      const middleware = globalValidationMiddleware.inputMiddleware(testSchema);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        error: expect.any(Object)
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('errorHandler', () => {
    it('should handle generic errors', () => {
      const error = new Error('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong'
      });
    });

    it('should handle validation errors', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong'
      });
    });
  });

  describe('assignRole', () => {
    it('should assign buyer role', async () => {
      const middleware = assignRoleMiddleware(ROLES.BUYER);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.role).toBe(ROLES.BUYER);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should assign seller role', async () => {
      const middleware = assignRoleMiddleware(ROLES.SELLER);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.role).toBe(ROLES.SELLER);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should assign admin role', async () => {
      const middleware = assignRoleMiddleware(ROLES.ADMIN);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.role).toBe(ROLES.ADMIN);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should not overwrite existing role', async () => {
      mockReq.body.role = ROLES.ADMIN;
      
      const middleware = assignRoleMiddleware(ROLES.BUYER);
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.body.role).toBe(ROLES.BUYER); // Should overwrite
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
