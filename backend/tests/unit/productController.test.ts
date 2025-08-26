import { Request, Response, NextFunction } from 'express';
import { productHandler } from '../../src/controllers/product/product';
import { productServices } from '../../src/services/product/product';

// Mock product services
jest.mock('../../src/services/product/product');

const { getAllProductsHandler, getProductHandler, createProductHandler, updateProductHandler } = productHandler;

const mockProductServices = productServices as jest.Mocked<typeof productServices>;

describe('Product Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
      body: {},
      user: { id: 'user123', role: 'SELLER' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products with pagination', async () => {
      const mockProductsData = {
        products: [
          { _id: 'product1', name: 'Product 1', price: 100 },
          { _id: 'product2', name: 'Product 2', price: 200 }
        ],
        totalProducts: 2,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
      };

      mockProductServices.getAllProducts = jest.fn().mockResolvedValue(mockProductsData);

      await getAllProductsHandler(mockReq as Request, mockRes as Response);

      expect(mockProductServices.getAllProducts).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'All products retrieved successfully',
        data: mockProductsData
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockProductServices.getAllProducts = jest.fn().mockRejectedValue(error);

      await getAllProductsHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve products',
        error: 'Service error'
      });
    });
  });

  describe('getProductById', () => {
    it('should return product by ID', async () => {
      const mockProduct = {
        _id: 'product123',
        name: 'Test Product',
        price: 100,
        description: 'Test description'
      };

      mockReq.params = { id: 'product123' };
      mockProductServices.getProductById = jest.fn().mockResolvedValue(mockProduct);

      await getProductHandler(mockReq as Request, mockRes as Response);

      expect(mockProductServices.getProductById).toHaveBeenCalledWith('product123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product retrieved successfully',
        data: mockProduct
      });
    });

    it('should handle product not found', async () => {
      const error = new Error('Product not found');
      mockReq.params = { id: 'nonexistent' };
      mockProductServices.getProductById = jest.fn().mockRejectedValue(error);

      await getProductHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve product',
        error: 'Product not found'
      });
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const productData = {
        name: 'New Product',
        description: 'Product description',
        price: 100,
        category: 'electronics',
        stock: 10,
        images: []
      };
      const createdProduct = {
        _id: 'product123',
        ...productData,
        seller: 'user123'
      };

      mockReq.body = productData;
      mockProductServices.createProduct = jest.fn().mockResolvedValue(createdProduct);

      await createProductHandler(mockReq as Request, mockRes as Response);

      expect(mockProductServices.createProduct).toHaveBeenCalledWith(productData, 'user123');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product created successfully',
        data: createdProduct
      });
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockReq.body = { name: 'New Product' };
      mockProductServices.createProduct = jest.fn().mockRejectedValue(error);

      await createProductHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create product',
        error: 'Creation failed'
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 150
      };
      const updatedProduct = {
        _id: 'product123',
        ...updateData
      };

      mockReq.params = { id: 'product123' };
      mockReq.body = updateData;
      mockProductServices.updateProduct = jest.fn().mockResolvedValue(updatedProduct);

      await updateProductHandler(mockReq as Request, mockRes as Response);

      expect(mockProductServices.updateProduct).toHaveBeenCalledWith(updateData, 'product123', 'user123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockReq.params = { id: 'product123' };
      mockReq.body = { name: 'Updated Product' };
      mockProductServices.updateProduct = jest.fn().mockRejectedValue(error);

      await updateProductHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update product',
        error: 'Update failed'
      });
    });
  });
});
