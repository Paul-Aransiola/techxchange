import { isDateExpired, generatePassword, sendResponse } from '../../src/utils/util/helpers';
import { hash } from 'bcrypt';
import { Response } from 'express';

// Mock bcrypt
jest.mock('bcrypt');
const mockHash = hash as jest.MockedFunction<typeof hash>;

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isDateExpired', () => {
    it('should return false for a date that is not expired', () => {
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() - 1); // 1 minute ago
      
      const result = isDateExpired(futureDate);
      
      expect(result).toBe(false);
    });

    it('should return true for a date that is expired', () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 5); // 5 minutes ago (expired after 2 minutes)
      
      const result = isDateExpired(pastDate);
      
      expect(result).toBe(true);
    });

    it('should return false for the current time', () => {
      const currentDate = new Date();
      
      const result = isDateExpired(currentDate);
      
      expect(result).toBe(false);
    });
  });

  describe('generatePassword', () => {
    it('should hash password with default salt rounds', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword123';

      mockHash.mockResolvedValue(hashedPassword as never);

      const result = await generatePassword(password);

      expect(mockHash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should hash password with custom salt rounds', async () => {
      const password = 'testPassword123';
      const saltRounds = 12;
      const hashedPassword = 'hashedPassword123';

      mockHash.mockResolvedValue(hashedPassword as never);

      const result = await generatePassword(password, saltRounds);

      expect(mockHash).toHaveBeenCalledWith(password, saltRounds);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('sendResponse', () => {
    let mockRes: Partial<Response>;

    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
    });

    it('should send success response with data', () => {
      const statusCode = 200;
      const success = true;
      const message = 'Success message';
      const data = { id: 1, name: 'Test' };

      sendResponse(mockRes as Response, statusCode, success, message, data);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success,
        message,
        data
      });
    });

    it('should send error response without data', () => {
      const statusCode = 400;
      const success = false;
      const message = 'Error message';
      const error = new Error('Test error');

      sendResponse(mockRes as Response, statusCode, success, message, null, error);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success,
        message,
        error: expect.any(String)
      });
    });

    it('should send response without data or error', () => {
      const statusCode = 204;
      const success = true;
      const message = 'No content';

      sendResponse(mockRes as Response, statusCode, success, message);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success,
        message
      });
    });

    it('should handle error response in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const statusCode = 500;
      const success = false;
      const message = 'Internal server error';
      const error = new Error('Detailed error message');

      sendResponse(mockRes as Response, statusCode, success, message, null, error);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success,
        message,
        error: 'An error occurred'
      });

      process.env.NODE_ENV = originalEnv;
    });
  });
});
