import Joi from 'joi';

export const deriveValidationError = (errorResponse: Joi.ValidationError) => {
  // Map Joi error messages to custom error codes

  return errorResponse.details.reduce((acc: Record<string, unknown>, err) => {
    acc[err.path.join('.')] = {
      message: err.message,
    };
    return acc;
  }, {});
};
