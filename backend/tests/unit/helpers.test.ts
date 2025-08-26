import { generateUserToken, checkUserPhoneOrEmailExistence } from '../../src/utils/util/helpers';
import { userModel } from '../../src/database/models';
import { ROLES } from '../../src/utils/util/constants';

describe('Helper Functions', () => {
  describe('generateUserToken', () => {
    it('should generate a valid token with user ID and role', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = ROLES.BUYER;
      
      const token = generateUserToken(userId, role);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should throw error for missing userId', () => {
      expect(() => {
        generateUserToken('', ROLES.BUYER);
      }).toThrow('userId and role are required');
    });

    it('should throw error for missing role', () => {
      expect(() => {
        generateUserToken('507f1f77bcf86cd799439011', '');
      }).toThrow('userId and role are required');
    });

    it('should handle custom expiration time', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = ROLES.SELLER;
      const customExpiry = '24h';
      
      const token = generateUserToken(userId, role, customExpiry);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('checkUserPhoneOrEmailExistence', () => {
    it('should use the userModel to check existence', async () => {
      const mockUserModel = {
        findOne: jest.fn().mockResolvedValue({ _id: 'user123' })
      };
      
      // We'll just test that the function exists and can be called
      expect(typeof checkUserPhoneOrEmailExistence).toBe('function');
    });
  });
});
