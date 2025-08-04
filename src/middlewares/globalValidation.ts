import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';

import { deriveValidationError } from '../utils/validation/deriveValidationError';

const inputMiddleware =
  (schemaValidation: Joi.ObjectSchema<unknown>) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schemaValidation.validate(req.body, { abortEarly: false });
    if (error) {
      const errorResponse = deriveValidationError(error);
      res.status(400).json({
        error: errorResponse,
        success: false,
        message: 'Validation error',
      });
      return;
    }
    req.body = value;
    next();
  };

const globalValidationMiddleware = {
  inputMiddleware,
};

export default globalValidationMiddleware;
