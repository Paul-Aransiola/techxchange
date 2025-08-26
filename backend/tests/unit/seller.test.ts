import { Request, Response } from 'express';
import { sellerBioHandler } from '../../src/controllers/seller';
import { sellerServices } from '../../src/services/seller';

// Mock the service
jest.mock('../../src/services/seller');
jest.mock('../../src/utils/util/logger');

const mockedSellerServices = sellerServices as jest.Mocked<typeof sellerServices>;

describe('Seller Controller', () => {
  let mockReq: Partial<Request & { user?: any; params?: any }>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: { id: 'userId' },
      user: { id: 'userId' },
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getSellerBioHandler', () => {
    it('should get seller bio successfully', async () => {
      const mockSeller = { _id: 'sellerId', businessName: 'Test Business' };
      mockedSellerServices.getSellerById.mockResolvedValue(mockSeller as any);

      await sellerBioHandler.getSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockedSellerServices.getSellerById).toHaveBeenCalledWith('userId');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Seller bio retrieved successfully',
        data: mockSeller,
      });
    });

    it('should handle errors when getting seller bio', async () => {
      mockedSellerServices.getSellerById.mockRejectedValue(new Error('Database error'));

      await sellerBioHandler.getSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve seller bio data',
        error: 'Database error',
      });
    });
  });

  describe('getAllSellersBioHandler', () => {
    it('should get all sellers successfully', async () => {
      const mockSellers = {
        sellers: [{ _id: 'seller1' }, { _id: 'seller2' }],
        totalSellers: 2,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };
      mockedSellerServices.getAllSellers.mockResolvedValue(mockSellers as any);

      await sellerBioHandler.getAllSellersBioHandler(mockReq as Request, mockRes as Response);

      expect(mockedSellerServices.getAllSellers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Sellers bio retrieved successfully',
        data: mockSellers,
      });
    });
  });

  describe('updateSellerBioHandler', () => {
    it('should update seller bio successfully', async () => {
      const mockUpdatedSeller = { _id: 'sellerId', businessName: 'Updated Business' };
      mockReq.body = { businessName: 'Updated Business' };
      mockedSellerServices.updateSeller.mockResolvedValue(mockUpdatedSeller as any);

      await sellerBioHandler.updateSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockedSellerServices.updateSeller).toHaveBeenCalledWith(mockReq.body, 'userId');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Seller bio updated successfully',
        data: mockUpdatedSeller,
      });
    });

    it('should handle errors when updating seller bio', async () => {
      mockedSellerServices.updateSeller.mockRejectedValue(new Error('Update failed'));

      await sellerBioHandler.updateSellerBioHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update seller bio data',
        error: 'Update failed',
      });
    });
  });
});
