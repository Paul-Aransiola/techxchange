import { authenticationService } from '../../src/services/auth';
import { userModel, sellerModel } from '../../src/database/models';
import { generateUserToken, checkUserPhoneOrEmailExistence } from '../../src/utils/util/helpers';
import { ROLES } from '../../src/utils/util/constants';

// Mock dependencies
jest.mock('../../src/database/models');
jest.mock('../../src/utils/util/helpers');

const mockUserModel = userModel as jest.Mocked<typeof userModel>;
const mockSellerModel = sellerModel as jest.Mocked<typeof sellerModel>;
const mockGenerateUserToken = generateUserToken as any;
const mockCheckUserPhoneOrEmailExistence = checkUserPhoneOrEmailExistence as jest.MockedFunction<typeof checkUserPhoneOrEmailExistence>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phoneNumber: '+123456789012',
        dateOfBirth: '1990-01-01',
        role: ROLES.BUYER
      };

      const createdUser = {
        _id: 'user123',
        ...userData
      };

      const token = 'jwt-token-123';

      // Mock user doesn't exist
      mockCheckUserPhoneOrEmailExistence.mockResolvedValue(false);
      
      // Mock user creation
      mockUserModel.create = jest.fn().mockResolvedValue([createdUser]);
      
      // Mock token generation
      mockGenerateUserToken.mockReturnValue(token);

      const result = await authenticationService.registerUser(userData);

      expect(mockCheckUserPhoneOrEmailExistence).toHaveBeenCalledWith(userData.email, userData.phoneNumber);
      expect(mockUserModel.create).toHaveBeenCalled();
      expect(mockGenerateUserToken).toHaveBeenCalledWith(createdUser._id.toString(), userData.role);
      expect(result).toEqual({ user: createdUser, token });
    });

    it('should throw error when user already exists', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phoneNumber: '+123456789012',
        dateOfBirth: '1990-01-01',
        role: ROLES.BUYER
      };

      mockCheckUserPhoneOrEmailExistence.mockResolvedValue(true);

      await expect(authenticationService.registerUser(userData)).rejects.toThrow('Phone number or email already exists.');
    });

    it('should create seller profile if role is SELLER', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phoneNumber: '+123456789012',
        dateOfBirth: '1990-01-01',
        role: ROLES.SELLER
      };

      const createdUser = {
        _id: 'user123',
        ...userData
      };

      const token = 'jwt-token-123';

      mockCheckUserPhoneOrEmailExistence.mockResolvedValue(false);
      mockUserModel.create = jest.fn().mockResolvedValue([createdUser]);
      mockSellerModel.create = jest.fn().mockResolvedValue([{ _id: 'seller123', user: 'user123' }]);
      mockGenerateUserToken.mockReturnValue(token);

      const result = await authenticationService.registerUser(userData);

      expect(mockSellerModel.create).toHaveBeenCalled();
      expect(result).toEqual({ user: createdUser, token });
    });
  });

  describe('signInUser', () => {
    it('should sign in user successfully with valid credentials', async () => {
      const signInData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const existingUser = {
        _id: 'user123',
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: signInData.email,
        role: ROLES.BUYER,
        verifyPassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        lastLogin: new Date()
      };

      const token = 'jwt-token-123';

      mockUserModel.findOne = jest.fn().mockResolvedValue(existingUser);
      mockGenerateUserToken.mockResolvedValue(token);

      const result = await authenticationService.signInUser(signInData);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: signInData.email });
      expect(existingUser.verifyPassword).toHaveBeenCalledWith(signInData.password);
      expect(mockGenerateUserToken).toHaveBeenCalledWith(existingUser.id.toString(), existingUser.role);
      expect(result).toEqual({
        user: existingUser,
        token
      });
    });

    it('should throw error if user not found', async () => {
      const signInData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(authenticationService.signInUser(signInData)).rejects.toThrow('Incorrect email/password.');
    });

    it('should throw error if password is incorrect', async () => {
      const signInData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const existingUser = {
        _id: 'user123',
        email: signInData.email,
        verifyPassword: jest.fn().mockResolvedValue(false)
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue(existingUser);

      await expect(authenticationService.signInUser(signInData)).rejects.toThrow('Incorrect email/password.');
    });
  });
});
