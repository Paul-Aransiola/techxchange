import { Router } from 'express';
import { sellerBioHandler } from '../controllers/seller';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import { ROLES } from '../utils/util/constants';


const sellerRouter = Router();

sellerRouter.get('/', sellerBioHandler.getAllSellersBioHandler);
sellerRouter.get('/:id', sellerBioHandler.getSellerBioHandler);
sellerRouter.put('/', authorizeMiddleware([ROLES.SELLER]), sellerBioHandler.updateSellerBioHandler
  );

export default sellerRouter;