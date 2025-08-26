import request from 'supertest';
import app from '../../src/app';
import { userModel } from '../../src/database/models';
import { generateUserToken } from '../../src/utils/util/helpers';
import { ROLES } from '../../src/utils/util/constants';

describe('Authentication Endpoints', () => {
  describe('POST /api/v1/auth/buyer/sign-up', () => {
    it('should register a new buyer successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.buyer@example.com',
        phoneNumber: '+1234567890123',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/v1/auth/buyer/sign-up')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('successful')
      });
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.role).toBe(ROLES.BUYER);
    });
  });

  describe('POST /api/v1/auth/seller/sign-up', () => {
    it('should register a new seller successfully', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'seller@example.com',
        phoneNumber: '+444444444444',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/v1/auth/seller/sign-up')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('successful')
      });
      expect(response.body.data.user.role).toBe(ROLES.SELLER);
    });
  });

  describe('POST /api/v1/auth/sign-in', () => {
    beforeEach(async () => {
      // Clean up any existing test user first
      await userModel.deleteOne({ email: 'test@example.com' });
      
      // Create test user
      await userModel.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        password: 'Password123!',
        role: ROLES.BUYER
      });
    });

    afterEach(async () => {
      // Clean up test user after each test
      await userModel.deleteOne({ email: 'test@example.com' });
    });

    it('should sign in with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/v1/auth/sign-in')
        .send(credentials)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('complete')
      });
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });

    it('should return 400 for invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/v1/auth/sign-in')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/v1/auth/sign-in')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
