import { authenticationService } from '../../src/services/auth';
import { userModel } from '../../src/database/models';
import { checkUserPhoneOrEmailExistence, generateUserToken } from '../../src/utils/util/helpers';
import { ROLES } from '../../src/utils/util/constants';

// Mock dependencies
jest.mock('../../src/database/models');
jest.mock('../../src/utils/util/helpers');
jest.mock('../../src/database/utils');

const mockUserModel = userModel as jest.Mocked<typeof userModel>;
const mockCheckUserPhoneOrEmailExistence = checkUserPhoneOrEmailExistence as jest.MockedFunction<typeof checkUserPhoneOrEmailExistence>;
const mockGenerateUserToken = generateUserToken as jest.MockedFunction<typeof generateUserToken>;

// Mock mongooseTransaction
jest.mock('../../src/database/utils', () => ({
  mongooseTransaction: jest.fn((callback) => callback({}))
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890123',
        password: 'Password123!',
        role: ROLES.BUYER
      };

      const savedUser = {
        _id: 'user123',
        ...userData
      };

      const token = 'mock-token';

      mockCheckUserPhoneOrEmailExistence.mockResolvedValue(false);
      mockUserModel.create = jest.fn().mockResolvedValue([savedUser]);
      mockGenerateUserToken.mockReturnValue(token);

      const result = await authenticationService.registerUser(userData);

      expect(mockCheckUserPhoneOrEmailExistence).toHaveBeenCalledWith(userData.email, userData.phoneNumber);
      expect(mockGenerateUserToken).toHaveBeenCalledWith(savedUser._id.toString(), userData.role);
      expect(result).toEqual({ user: savedUser, token });
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890123',
        password: 'Password123!',
        role: ROLES.BUYER
      };

      mockCheckUserPhoneOrEmailExistence.mockResolvedValue(true);

      await expect(authenticationService.registerUser(userData)).rejects.toThrow('Phone number or email already exists.');
    });
  });

  describe('signInUser', () => {
    it('should successfully sign in a user with valid credentials', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'Password123!'
      };

      const foundUser = {
        id: 'user123',
        email: credentials.email,
        password: 'hashedPassword123',
        role: ROLES.BUYER,
        firstName: 'John',
        lastName: 'Doe',
        verifyPassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        lastLogin: new Date()
      };

      const token = 'mock-token';

      mockUserModel.findOne = jest.fn().mockResolvedValue(foundUser);
      mockGenerateUserToken.mockReturnValue(token);

      const result = await authenticationService.signInUser(credentials);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(foundUser.verifyPassword).toHaveBeenCalledWith(credentials.password);
      expect(mockGenerateUserToken).toHaveBeenCalledWith(foundUser.id.toString(), foundUser.role);
      expect(result).toEqual({ user: foundUser, token });
    });

    it('should throw error if user not found', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(authenticationService.signInUser(credentials)).rejects.toThrow('Incorrect email/password.');
    });

    it('should throw error if password is incorrect', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'WrongPassword123!'
      };

      const foundUser = {
        id: 'user123',
        email: credentials.email,
        password: 'hashedPassword123',
        role: ROLES.BUYER,
        firstName: 'John',
        lastName: 'Doe',
        verifyPassword: jest.fn().mockResolvedValue(false),
        save: jest.fn().mockResolvedValue(true),
        lastLogin: new Date()
      };

      mockUserModel.findOne = jest.fn().mockResolvedValue(foundUser);

      await expect(authenticationService.signInUser(credentials)).rejects.toThrow('Incorrect email/password.');
    });
  });
});
