import { Request, Response, NextFunction } from 'express';
import { sellerServices } from '../../src/services/seller';
import { sellerModel, productModel } from '../../src/database/models';

// Mock dependencies
jest.mock('../../src/database/models');

const mockSellerModel = sellerModel as jest.Mocked<typeof sellerModel>;
const mockProductModel = productModel as jest.Mocked<typeof productModel>;

describe('Seller Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSellers', () => {
    it('should return all sellers with default pagination', async () => {
      const mockSellers: any[] = [
        { _id: 'seller1', businessName: 'Business 1' },
        { _id: 'seller2', businessName: 'Business 2' }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockSellers)
      };

      mockSellerModel.countDocuments = jest.fn().mockResolvedValue(2);
      mockSellerModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await sellerServices.getAllSellers();

      expect(mockSellerModel.countDocuments).toHaveBeenCalled();
      expect(mockSellerModel.find).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalledWith('user');
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(result).toMatchObject({
        sellers: mockSellers,
        totalSellers: 2,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
      });
    });

    it('should handle search filter', async () => {
      const filter = { search: 'New York' };
      const mockSellers: any[] = [];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockSellers)
      };

      mockSellerModel.countDocuments = jest.fn().mockResolvedValue(0);
      mockSellerModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await sellerServices.getAllSellers(filter);

      expect(mockSellerModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            expect.objectContaining({ 'address.city': { $regex: 'New York', $options: 'i' } })
          ])
        })
      );
      expect(result.sellers).toEqual(mockSellers);
    });

    it('should handle pagination', async () => {
      const pagination = { page: 2, limit: 5 };
      const mockSellers: any[] = [];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockSellers)
      };

      mockSellerModel.countDocuments = jest.fn().mockResolvedValue(15);
      mockSellerModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await sellerServices.getAllSellers({}, pagination);

      expect(mockQuery.skip).toHaveBeenCalledWith(5); // (page - 1) * limit
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
    });
  });

  describe('getSellerById', () => {
    it('should return seller by user ID with populated user data', async () => {
      const userId = 'user123';
      const mockSeller = {
        _id: 'seller123',
        user: {
          _id: userId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      };

      // Mock findById to return null (not found by seller ID)
      mockSellerModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      // Mock findOne to return seller (found by user ID)
      mockSellerModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSeller)
      });

      const result = await sellerServices.getSellerById(userId);

      expect(mockSellerModel.findById).toHaveBeenCalledWith(userId);
      expect(mockSellerModel.findOne).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(mockSeller);
    });

    it('should throw error if seller not found', async () => {
      const userId = 'nonexistent';
      
      // Mock both findById and findOne to return null
      mockSellerModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      mockSellerModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(sellerServices.getSellerById(userId)).rejects.toThrow('Seller not found.');
    });
  });

  describe('updateSeller', () => {
    it('should update seller successfully', async () => {
      const userId = 'user123';
      const updateData = {
        bio: 'Updated bio',
        address: {
          city: 'New York',
          state: 'NY',
          country: 'USA'
        }
      };

      const updatedSeller = {
        _id: 'seller123',
        user: userId,
        ...updateData
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(updatedSeller)
      };

      mockSellerModel.findOneAndUpdate = jest.fn().mockReturnValue(mockQuery);

      const result = await sellerServices.updateSeller(updateData, userId);

      expect(mockSellerModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: userId },
        { $set: updateData },
        { new: true }
      );
      expect(mockQuery.select).toHaveBeenCalledWith("-__v");
      expect(result).toEqual(updatedSeller);
    });
  });
});
