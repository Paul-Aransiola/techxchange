import { Request, Response, NextFunction } from 'express';
import { sellerBioHandler } from '../../src/controllers/seller';
import { sellerServices } from '../../src/services/seller';

// Mock seller services
jest.mock('../../src/services/seller');

const mockSellerServices = sellerServices as jest.Mocked<typeof sellerServices>;

// Mock data
const mockSeller = { _id: 'seller123', bio: 'Test bio', user: { name: 'John' } };
const mockUpdatedSeller = { _id: 'seller123', bio: 'Updated bio', user: { name: 'John' } };
const mockSellers = {
  sellers: [mockSeller, { _id: 'seller456', bio: 'Another bio', user: { name: 'Jane' } }],
  totalSellers: 2,
  totalPages: 1,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false
};

describe('Seller Controller', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      params: { id: 'seller123' },
      query: {},
      user: { id: 'user123' },
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getSellerBioHandler', () => {
    it('should get seller bio successfully', async () => {
      const mockSeller = { _id: 'seller123', businessName: 'Test Business' };
      mockSellerServices.getSellerById = jest.fn().mockResolvedValue(mockSeller);

      await sellerBioHandler.getSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockSellerServices.getSellerById).toHaveBeenCalledWith('seller123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Seller bio retrieved successfully',
        data: mockSeller
      });
    });

    it('should handle errors when getting seller bio', async () => {
      const error = new Error('Seller not found');
      mockSellerServices.getSellerById = jest.fn().mockRejectedValue(error);

      await sellerBioHandler.getSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve seller bio data',
        error: 'Seller not found'
      });
    });
  });

  describe('getAllSellersBioHandler', () => {
    it('should get all sellers successfully', async () => {
      const mockReqWithQuery = {
        ...mockReq,
        query: {
          page: '1',
          limit: '10'
        }
      };

      mockSellerServices.getAllSellers = jest.fn().mockResolvedValue(mockSellers);

      await sellerBioHandler.getAllSellersBioHandler(mockReqWithQuery as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateSellerBioHandler', () => {
    it('should update seller bio successfully', async () => {
      const mockUpdatedSeller = { _id: 'seller123', businessName: 'Updated Business' };
      mockSellerServices.updateSeller = jest.fn().mockResolvedValue(mockUpdatedSeller);

      await sellerBioHandler.updateSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors when updating seller bio', async () => {
      const error = new Error('Update failed');
      mockSellerServices.updateSeller = jest.fn().mockRejectedValue(error);

      await sellerBioHandler.updateSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update seller bio data',
        error: 'Update failed'
      });
    });
  });
});
