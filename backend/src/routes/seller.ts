import { Router } from 'express';
import { sellerBioHandler } from '../controllers/seller';
import { productHandler } from '../controllers/product/product';

import { authorizeMiddleware } from '../middlewares/auth/authorization';
import { ROLES } from '../utils/util/constants';
import globalValidationMiddleware from '../middlewares/globalValidation';
import sellerValidators from '../utils/validation/sellerValidators';


const sellerRouter = Router();

sellerRouter.get('/', sellerBioHandler.getAllSellersBioHandler);

sellerRouter.put(
  '/', 
  authorizeMiddleware([ROLES.SELLER]), 
  globalValidationMiddleware.inputMiddleware(sellerValidators.updateSellerValidator),
  sellerBioHandler.updateSellerBioHandler
  );
  
    
sellerRouter.get(
  '/:id/products', 
  authorizeMiddleware([ROLES.SELLER, ROLES.BUYER]), 
  productHandler.getAllSellerProductsHandler);

sellerRouter.get('/:id', sellerBioHandler.getSellerBioHandler);
export default sellerRouter;