import request from 'supertest';
import app from '../../src/app';
import { userModel, productModel, sellerModel } from '../../src/database/models';
import { generateUserToken } from '../../src/utils/util/helpers';
import { ROLES } from '../../src/utils/util/constants';

describe('E2E: Complete User Journey', () => {
  let buyerToken: string;
  let sellerToken: string;
  let sellerId: string;
  let productId: string;

  beforeAll(async () => {
    // Create fresh users for the entire test suite
    // Create buyer
    const buyerData = {
      firstName: 'John',
      lastName: 'Buyer',
      email: 'buyer@example.com',
      phoneNumber: '+123456789012',
      password: 'Password123!'
    };

    const buyerResponse = await request(app)
      .post('/api/v1/auth/buyer/sign-up')
      .send(buyerData);

    if (buyerResponse.status !== 201) {
      throw new Error(`Buyer registration failed with status ${buyerResponse.status}`);
    }

    buyerToken = buyerResponse.body.data.token;

    // Create seller
    const sellerData = {
      firstName: 'Jane',
      lastName: 'Seller',
      email: 'seller@example.com',
      phoneNumber: '+987654321098',
      password: 'Password123!'
    };

    const sellerResponse = await request(app)
      .post('/api/v1/auth/seller/sign-up')
      .send(sellerData);

    if (sellerResponse.status !== 201) {
      throw new Error(`Seller registration failed with status ${sellerResponse.status}`);
    }

    sellerToken = sellerResponse.body.data.token;
    sellerId = sellerResponse.body.data.user._id;
  });

    describe('Seller Journey', () => {
    it('should allow seller to update their profile', async () => {
      const response = await request(app)
        .put('/api/v1/sellers')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          address: {
            location: '123 Tech Street',
            city: 'Tech City',
            state: 'Tech State'
          },
          bankDetails: {
            bankName: 'Tech Bank',
            accountName: 'Jane Seller',
            accountNumber: '1234567890'
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.address.city).toBe('tech city'); // lowercase due to schema
    });



    it('should allow seller to create a product', async () => {
      const testProductData = {
        name: 'MacBook Pro',
        description: 'Latest MacBook Pro with M3 chip for professional work',
        price: 2000,
        category: 'electronics',
      };
      
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(testProductData);
        
      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      productId = response.body.data._id;
    });

    it('should allow seller to view their products', async () => {
      const response = await request(app)
        .get('/api/v1/sellers/products')
        .set('Authorization', `Bearer ${sellerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toBe('macbook pro');
    });
  });

  describe('Buyer Journey', () => {
    it('should allow buyer to view all products', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data).toHaveProperty('totalProducts');
      expect(response.body.data).toHaveProperty('totalPages');
    });

    it('should allow buyer to filter products by price', async () => {
      const response = await request(app)
        .get('/api/v1/products?minPrice=1000&maxPrice=2500')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].price).toBeGreaterThanOrEqual(1000);
      expect(response.body.data.products[0].price).toBeLessThanOrEqual(2500);
    });

    it('should allow buyer to search products', async () => {
      const response = await request(app)
        .get('/api/v1/products?search=MacBook')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toContain('macbook'); // Database stores lowercase
    });

    it('should allow buyer to view product details', async () => {
      const response = await request(app)
        .get(`/api/v1/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(productId);
      expect(response.body.data.name).toBe('macbook pro'); // Database stores lowercase
    });

    it('should allow buyer to create a review', async () => {
      const reviewData = {
        text: 'Excellent product quality!',
        rating: 5
      };

      const response = await request(app)
        .post(`/api/v1/products/${productId}/reviews`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(reviewData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.text).toBe('excellent product quality!');
      expect(response.body.data.rating).toBe(reviewData.rating);
    });

    it('should allow anyone to view product reviews', async () => {
      const response = await request(app)
        .get(`/api/v1/products/${productId}/reviews`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviews).toHaveLength(1);
      expect(response.body.data.reviews[0].rating).toBe(5);
    });
  });

  describe('News Integration', () => {
    it('should fetch tech news', async () => {
      const response = await request(app)
        .get('/api/v1/news/tech')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('articles');
      expect(response.body.data).toHaveProperty('totalResults');
      expect(response.body.data).toHaveProperty('cached');
    });

    it('should search news by keyword', async () => {
      const response = await request(app)
        .get('/api/v1/news/search?q=technology')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('articles');
    });
  });

  describe('Seller Management', () => {
    it('should allow viewing all sellers', async () => {
      const response = await request(app)
        .get('/api/v1/sellers')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sellers).toHaveLength(1);
    });

    it('should allow viewing specific seller details', async () => {
      // First get all sellers to find the correct seller profile ID
      const sellersResponse = await request(app)
        .get('/api/v1/sellers')
        .expect(200);
      
      const sellerProfileId = sellersResponse.body.data.sellers[0]._id;
      
      const response = await request(app)
        .get(`/api/v1/sellers/${sellerProfileId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(sellerProfileId);
    });
  });
});
