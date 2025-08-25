import { Router } from 'express';
import { productHandler } from '../controllers/product/product';
import { reviewHandler } from '../controllers/product/review'
import globalValidationMiddleware from '../middlewares/globalValidation';
import productValidators from '../utils/validation/productValidator';
import { authorizeMiddleware } from '../middlewares/auth/authorization';
import { ROLES } from '../utils/util/constants';

const ProductRouter = Router();


ProductRouter.get('/', productHandler.getAllProductsHandler);
ProductRouter.post(
    '/',
    authorizeMiddleware([ROLES.SELLER]),
    globalValidationMiddleware.inputMiddleware(productValidators.productDetails),
    productHandler.createProductHandler
)

ProductRouter.put(
    '/:id',
    authorizeMiddleware([ROLES.SELLER]),
    globalValidationMiddleware.inputMiddleware(productValidators.productDetails),
    productHandler.updateProductHandler
)

ProductRouter.get('/:id', productHandler.getProductHandler);

ProductRouter.post(
    '/:id/reviews',
    authorizeMiddleware([ROLES.BUYER]),
    globalValidationMiddleware.inputMiddleware(productValidators.review),
    reviewHandler.createReviewHandler
);

ProductRouter.get(
    '/:id/reviews',
    reviewHandler.getProductReviewsHandler
);

ProductRouter.get(
    '/reviews/:id',
    reviewHandler.getReviewHandler
);



export default ProductRouter;




