import mongoose from 'mongoose';
import { productModel, sellerModel, userModel } from '../database/models';
import logger from '../utils/util/logger';
import { ROLES } from '../utils/util/constants';
import { MONGO_DB_NAME, MONGO_URI } from '../config';

const fixSellerProductReferences = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/${MONGO_DB_NAME}`);
    logger.info('Connected to MongoDB for data fixing');

    // 1. Check for products without valid seller references
    const productsWithInvalidSellers = await productModel.find({}).populate('seller');
    
    let invalidCount = 0;
    const invalidProducts = [];

    for (const product of productsWithInvalidSellers) {
      if (!product.seller) {
        invalidCount++;
        invalidProducts.push(product);
        logger.warn(`Product ${product._id} has invalid seller reference: ${product.seller}`);
      }
    }

    if (invalidCount > 0) {
      logger.info(`Found ${invalidCount} products with invalid seller references`);
      
      // Get all available sellers
      const availableSellers = await sellerModel.find({}).populate('user');
      
      if (availableSellers.length === 0) {
        // Create a default seller if none exist
        logger.info('No sellers found, creating default seller...');
        
        // Find or create a seller user
        let sellerUser = await userModel.findOne({ role: ROLES.SELLER });
        
        if (!sellerUser) {
          sellerUser = await userModel.create({
            firstName: 'Default',
            lastName: 'Seller',
            email: 'seller@techxchange.com',
            phoneNumber: '+123456789012',
            password: 'hashedpassword123',
            role: ROLES.SELLER
          });
          logger.info('Created default seller user');
        }

        const defaultSeller = await sellerModel.create({
          user: sellerUser._id,
          address: {
            location: 'Default Location',
            state: 'Default State',
            city: 'Default City'
          }
        });
        
        logger.info('Created default seller profile');
        availableSellers.push(defaultSeller);
      }

      // Assign the first available seller to all invalid products
      const defaultSeller = availableSellers[0];
      
      for (const product of invalidProducts) {
        await productModel.findByIdAndUpdate(product._id, {
          seller: defaultSeller._id
        });
        logger.info(`Fixed product ${product._id} - assigned seller ${defaultSeller._id}`);
      }
      
      logger.info(`Fixed ${invalidCount} products with invalid seller references`);
    } else {
      logger.info('All products have valid seller references');
    }

    // 2. Check overall data integrity
    const totalProducts = await productModel.countDocuments();
    const totalSellers = await sellerModel.countDocuments();
    const totalUsers = await userModel.countDocuments();

    logger.info(`Database summary:
      - Total products: ${totalProducts}
      - Total sellers: ${totalSellers}
      - Total users: ${totalUsers}
    `);

    logger.info('Data integrity check completed successfully');
    
  } catch (error) {
    logger.error('Error fixing seller-product references:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
};

// Run the fix if this file is executed directly
if (require.main === module) {
  fixSellerProductReferences()
    .then(() => {
      console.log('Database fix completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database fix failed:', error);
      process.exit(1);
    });
}

export default fixSellerProductReferences;
