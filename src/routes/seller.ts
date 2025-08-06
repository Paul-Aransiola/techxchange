import { Router } from 'express';
import { sellerBioHandler } from '../controllers/seller';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import { ROLES } from '../utils/util/constants';
import globalValidationMiddleware from '../middlewares/globalValidation';
import sellerValidators from '../utils/validation/sellerValidators';


const sellerRouter = Router();

sellerRouter.get('/', sellerBioHandler.getAllSellersBioHandler);
sellerRouter.get('/:id', sellerBioHandler.getSellerBioHandler);
sellerRouter.put(
  '/', 
  authorizeMiddleware([ROLES.SELLER]), 
  globalValidationMiddleware.inputMiddleware(sellerValidators.updateSellerValidator),
  sellerBioHandler.updateSellerBioHandler
  );

export default sellerRouter;