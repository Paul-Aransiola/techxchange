import { productServices } from '../../src/services/product/product';
import { productModel, sellerModel } from '../../src/database/models';

// Mock dependencies
jest.mock('../../src/database/models');

const mockProductModel = productModel as jest.Mocked<typeof productModel>;
const mockSellerModel = sellerModel as jest.Mocked<typeof sellerModel>;

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products with default pagination', async () => {
      const mockProducts: any[] = [
        { _id: 'product1', name: 'Product 1', price: 100, seller: { _id: 'seller1' } },
        { _id: 'product2', name: 'Product 2', price: 200, seller: { _id: 'seller2' } }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockProducts)
      };

      mockProductModel.countDocuments = jest.fn().mockResolvedValue(2);
      mockProductModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await productServices.getAllProducts();

      expect(mockProductModel.countDocuments).toHaveBeenCalled();
      expect(mockProductModel.find).toHaveBeenCalled();
      expect(result.products).toEqual(mockProducts);
      expect(result.totalProducts).toBe(2);
    });

    it('should handle search filter', async () => {
      const filter = { search: 'laptop' };
      const mockProducts: any[] = [];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockProducts)
      };

      mockProductModel.countDocuments = jest.fn().mockResolvedValue(0);
      mockProductModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await productServices.getAllProducts(filter);

      expect(mockProductModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            expect.objectContaining({ name: { $regex: 'laptop', $options: 'i' } })
          ])
        })
      );
      expect(result.products).toEqual(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should return product by ID', async () => {
      const productId = 'product123';
      const mockProduct = { _id: productId, name: 'Test Product', seller: { _id: 'seller1' } };

      mockProductModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProduct)
      });

      const result = await productServices.getProductById(productId);

      expect(mockProductModel.findOne).toHaveBeenCalledWith({ _id: productId });
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when product not found', async () => {
      const productId = 'nonexistent';

      mockProductModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(productServices.getProductById(productId)).rejects.toThrow('Product not found.');
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const productData = {
        name: 'New Product',
        description: 'A great product',
        price: 100,
        category: 'electronics'
      };
      const userId = 'user123';
      const mockSeller = { _id: 'seller123', user: userId };

      const createdProduct = {
        _id: 'product123',
        ...productData,
        seller: 'seller123'
      };

      // Mock seller lookup
      mockSellerModel.findOne = jest.fn().mockResolvedValue(mockSeller);
      mockProductModel.create = jest.fn().mockResolvedValue([createdProduct]); // Return array

      const result = await productServices.createProduct(productData, userId);

      expect(mockSellerModel.findOne).toHaveBeenCalledWith({ user: userId });
      expect(mockProductModel.create).toHaveBeenCalled();
      expect(result).toEqual(createdProduct);
    });

    it('should handle validation errors', async () => {
      const productData = {
        name: 'New Product',
        description: 'Description',
        category: 'electronics',
        price: 100
      };
      const userId = 'user123';
      const mockSeller = { _id: 'seller123', user: userId };

      // Mock seller lookup to succeed but product creation to fail
      mockSellerModel.findOne = jest.fn().mockResolvedValue(mockSeller);
      
      const validationError = new Error('Validation failed');
      mockProductModel.create = jest.fn().mockRejectedValue(validationError);

      await expect(productServices.createProduct(productData, userId)).rejects.toThrow(validationError);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const productId = 'product123';
      const userId = 'user123';
      const updateData = {
        name: 'Updated Product',
        description: 'Updated description',
        category: 'electronics',
        price: 150
      };
      const mockSeller = { _id: 'seller123', user: userId };

      const updatedProduct = {
        _id: productId,
        ...updateData
      };

      // Mock seller lookup and product update
      mockSellerModel.findOne = jest.fn().mockReturnValue({
        session: jest.fn().mockResolvedValue(mockSeller)
      });
      
      mockProductModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedProduct);

      const result = await productServices.updateProduct(updateData, productId, userId);

      expect(result).toEqual(updatedProduct);
    });
  });

  describe('getAllSellerProducts', () => {
    it('should return seller products with pagination', async () => {
      const sellerId = 'seller123';
      const filter = {};
      const pagination = { page: 1, limit: 10 };
      const mockSeller = { _id: sellerId, user: 'user123' };

      const mockProducts: any[] = [
        { _id: 'product1', name: 'Product 1', seller: sellerId },
        { _id: 'product2', name: 'Product 2', seller: sellerId }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockProducts)
      };

      // Mock seller lookup
      mockSellerModel.findOne = jest.fn().mockResolvedValue(mockSeller);
      mockProductModel.countDocuments = jest.fn().mockResolvedValue(2);
      mockProductModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await productServices.getAllSellerProducts(sellerId, filter, pagination);

      expect(mockProductModel.find).toHaveBeenCalledWith({ seller: sellerId });
      expect(result.products).toEqual(mockProducts);
      expect(result.totalProducts).toBe(2);
    });
  });
});