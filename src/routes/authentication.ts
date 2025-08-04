import { Router } from 'express';

import authenticationController from '../controllers/authController';
import globalValidationMiddleware from '../middlewares/globalValidation';
import authenticationValidation from '../utils/validation/authenticationValidation';
import { ROLES } from '../utils/util/constants';
import { assignRoleMiddleware } from '../middlewares/assignRoleMiddleware';

const authRouter = Router();


authRouter.post(
  '/seller/sign-up',
  globalValidationMiddleware.inputMiddleware(authenticationValidation.registerUser),
  assignRoleMiddleware(ROLES.SELLER),
  authenticationController.userRegistrationHandler
);


authRouter.post(
  '/sign-in',
  globalValidationMiddleware.inputMiddleware(authenticationValidation.signInUser),
  authenticationController.userSignInHandler
);

export default authRouter;
