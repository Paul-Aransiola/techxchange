import { Router } from 'express';

import authenticationController from '../controllers/authController';
import globalValidationMiddleware from '../middlewares/globalValidation';
import authenticationValidation from '../utils/validation/authenticationValidation';
import { ROLES } from '../utils/util/constants';
import { assignRoleMiddleware } from '../middlewares/assignRoleMiddleware';
import { authLimiter } from '../middlewares/rateLimiter';

const authRouter = Router();

// Apply auth rate limiting to all auth routes
authRouter.use(authLimiter);

authRouter.post(
  '/seller/sign-up',
  globalValidationMiddleware.inputMiddleware(authenticationValidation.registerUser),
  assignRoleMiddleware(ROLES.SELLER),
  authenticationController.userRegistrationHandler
);


authRouter.post(
  '/buyer/sign-up',
  globalValidationMiddleware.inputMiddleware(authenticationValidation.registerUser),
  assignRoleMiddleware(ROLES.BUYER),
  authenticationController.userRegistrationHandler
);


authRouter.post(
  '/sign-in',
  globalValidationMiddleware.inputMiddleware(authenticationValidation.signInUser),
  authenticationController.userSignInHandler
);

export default authRouter;
