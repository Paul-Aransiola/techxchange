import { Router } from 'express';
import { productHandler } from '../controllers/product';
import globalValidationMiddleware from '../middlewares/globalValidation';
import productValidators from '../utils/validation/productValidator';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import { ROLES } from '../utils/util/constants';

const ProductRouter = Router();

// Product routes
ProductRouter.get('/', productHandler.getAllProductsHandler);
ProductRouter.get('/:id', productHandler.getProductHandler);
ProductRouter.post(
    '/',
    authorizeMiddleware([ROLES.SELLER]), 
    globalValidationMiddleware.inputMiddleware(productValidators.productDetails),
    productHandler.createProductHandler
)



export default ProductRouter;




