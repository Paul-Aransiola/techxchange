import { reviewServices } from '../../src/services/product/review';
import { reviewModel, productModel, userModel } from '../../src/database/models';

// Mock dependencies
jest.mock('../../src/database/models');

const mockReviewModel = reviewModel as jest.Mocked<typeof reviewModel>;
const mockProductModel = productModel as jest.Mocked<typeof productModel>;
const mockUserModel = userModel as jest.Mocked<typeof userModel>;

// Mock data
const mockUser = { _id: 'user123', name: 'John Doe' };
const mockProduct = { _id: 'product123', name: 'Test Product' };
const mockReview = {
  _id: 'review123',
  text: 'Great product!',
  rating: 5,
  user: mockUser._id,
  product: mockProduct._id
};

describe('Review Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReviews', () => {
    it('should return paginated reviews with default options', async () => {
      const productId = 'product123';
      const mockReviews: any[] = [
        {
          _id: 'review1',
          rating: 5,
          text: 'Great product!',
          user: 'user1',
          product: 'product1'
        }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockReviews)
      };

      mockReviewModel.countDocuments = jest.fn().mockResolvedValue(1);
      mockReviewModel.find = jest.fn().mockReturnValue(mockQuery);
      mockReviewModel.aggregate = jest.fn().mockResolvedValue([{ averageRating: 5 }]);

      const result = await reviewServices.getAllReviews(productId);

      expect(mockReviewModel.countDocuments).toHaveBeenCalled();
      expect(mockReviewModel.find).toHaveBeenCalledWith({ product: productId });
      expect(result.reviews).toEqual(mockReviews);
      expect(result.totalReviews).toBe(1);
      expect(result.averageRating).toBe(5);
    });

    it('should handle rating filter', async () => {
      const productId = 'product123';
      const filter = { minRating: 4 };
      const mockReviews: any[] = [];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockReviews)
      };

      mockReviewModel.countDocuments = jest.fn().mockResolvedValue(0);
      mockReviewModel.find = jest.fn().mockReturnValue(mockQuery);
      mockReviewModel.aggregate = jest.fn().mockResolvedValue([{ averageRating: 0 }]);

      const result = await reviewServices.getAllReviews(productId, filter);

      expect(mockReviewModel.find).toHaveBeenCalledWith({
        product: productId,
        rating: { $gte: 4 }
      });
      expect(result.reviews).toEqual(mockReviews);
    });
  });

  describe('createProductReview', () => {
    it('should create a review successfully', async () => {
      const reviewData = {
        text: 'Great product!',
        rating: 5
      };
      const userId = 'user123';
      const productId = 'product123';

      const mockProduct = { _id: productId, name: 'Test Product' };
      const mockUser = { _id: userId, firstName: 'John', lastName: 'Doe' };
      const mockReview = {
        _id: 'review123',
        ...reviewData,
        user: userId,
        product: productId
      };

      mockProductModel.findById = jest.fn().mockResolvedValue(mockProduct);
      mockUserModel.findById = jest.fn().mockResolvedValue(mockUser);
      mockReviewModel.findOneAndUpdate = jest.fn().mockResolvedValue(mockReview);

      const result = await reviewServices.createProductReview(reviewData, userId, productId);

      expect(mockProductModel.findById).toHaveBeenCalledWith(productId);
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(mockReviewModel.findOneAndUpdate).toHaveBeenCalledWith(
        {
          user: mockUser._id,
          product: mockProduct._id
        },
        { $set: { ...reviewData } },
        { 
          upsert: true,
          new: true,
          runValidators: true 
        }
      );
      expect(result).toEqual(mockReview);
    });

    it('should throw error when product not found', async () => {
      const reviewData = { text: 'Great!', rating: 5 };
      const userId = 'user123';
      const productId = 'nonexistent';

      mockProductModel.findById = jest.fn().mockResolvedValue(null);

      await expect(
        reviewServices.createProductReview(reviewData, userId, productId)
      ).rejects.toThrow('Product not found');
    });

    it('should create a review successfully (upsert behavior)', async () => {
      const reviewData = { rating: 5, text: 'Great product!' };
      const userId = 'user123';
      const productId = 'product123';

      mockProductModel.findById = jest.fn().mockResolvedValue(mockProduct);
      mockUserModel.findById = jest.fn().mockResolvedValue(mockUser);
      mockReviewModel.findOneAndUpdate = jest.fn().mockResolvedValue(mockReview);

      const result = await reviewServices.createProductReview(reviewData, userId, productId);

      expect(result).toEqual(mockReview);
      expect(mockProductModel.findById).toHaveBeenCalledWith(productId);
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(mockReviewModel.findOneAndUpdate).toHaveBeenCalledWith(
        {
          user: mockUser._id,
          product: mockProduct._id
        },
        { $set: { ...reviewData } },
        { 
          upsert: true,
          new: true,
          runValidators: true 
        }
      );
    });
  });

  describe('getReviewById', () => {
    it('should return review by ID', async () => {
      const reviewId = 'review123';
      const mockReview = {
        _id: reviewId,
        text: 'Great product!',
        rating: 5
      };

      mockReviewModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockReview)
      });

      const result = await reviewServices.getReviewById(reviewId);

      expect(mockReviewModel.findById).toHaveBeenCalledWith({ _id: reviewId });
      expect(result).toEqual(mockReview);
    });

    it('should throw error when review not found', async () => {
      const reviewId = 'nonexistent';

      mockReviewModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(
        reviewServices.getReviewById(reviewId)
      ).rejects.toThrow('Review not found.');
    });
  });
});
