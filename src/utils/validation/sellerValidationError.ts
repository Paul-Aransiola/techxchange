import Joi from 'joi';

export const sellerValidationError = (errorResponse: Joi.ValidationError) => {

  return errorResponse.details.reduce((acc: Record<string, unknown>, err) => {
    acc[err.path.join('.')] = {
      message: err.message,
    };
    return acc;
  }, {});
};
