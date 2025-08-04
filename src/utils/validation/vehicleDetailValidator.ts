import * as Joi from 'joi';

const vehicleDetails = Joi.object({
  plateNumber: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Vehicle plate number should be a type of string',
    'string.empty': 'Vehicle plate number cannot be empty',
    'string.min': 'Vehicle plate number should have a minimum length of {#limit}',
    'string.max': 'Vehicle plate number should have a maximum length of {#limit}',
    'any.required': 'Vehicle plate number is a required field',
  }),
  type: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Vehicle type should be a type of string',
    'string.empty': 'Vehicle type cannot be empty',
    'string.min': 'Vehicle type should have a minimum length of {#limit}',
    'string.max': 'Vehicle type should have a maximum length of {#limit}',
    'any.required': 'Vehicle type is a required field',
  }),
  model: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Vehicle model should be a type of string',
    'string.empty': 'Vehicle model cannot be empty',
    'string.min': 'Vehicle model should have a minimum length of {#limit}',
    'string.max': 'Vehicle model should have a maximum length of {#limit}',
    'any.required': 'Vehicle model is a required field',
  }),
  year: Joi.number().integer().min(1995).max(new Date().getFullYear()).required().messages({
    'number.base': 'Vehicle year should be a number',
    'number.integer': 'Vehicle year should be an integer',
    'number.min': 'Vehicle year cannot be earlier than 1995',
    'number.max': `Vehicle year cannot be later than ${new Date().getFullYear()}`,
    'any.required': 'Vehicle year is a required field',
  }),
  doodle: Joi.string()
  .uri({ scheme: [/https?/] }) 
  .required()
  .messages({
    'string.base': 'Vehicle doodle should be a type of string',
    'string.empty': 'Vehicle doodle cannot be empty',
    'string.uri': 'Vehicle doodle must be a valid URL',
    'any.required': 'Vehicle doodle is a required field',
  }),
  freightWeight: Joi.number().greater(0).required().messages({
    'number.base': 'Vehicle freight weight should be a type of number',
    'number.greater': 'Vehicle freight weight must be greater than 0',
    'any.required': 'Vehicle freight weight is a required field',
  }),
  vehicleLength: Joi.number().greater(0).required().messages({
    'number.base': 'Vehicle length should be a type of number',
    'number.greater': 'Vehicle length must be greater than 0',
    'any.required': 'Vehicle length is a required field',
  }),
  vehicleWidth: Joi.number().greater(0).required().messages({
    'number.base': 'Vehicle width should be a type of number',
    'number.greater': 'Vehicle width must be greater than 0',
    'any.required': 'Vehicle width is a required field',
  }),
  insuranceDocuments: Joi.string()
  .uri({ scheme: [/https?/] })
  .required()
  .messages({
    'string.base': 'Vehicle insurance document should be a type of string',
    'string.empty': 'Vehicle insurance document cannot be empty',
    'string.uri': 'Vehicle insurance document must be a valid URL',
    'any.required': 'Vehicle insurance document is a required field',
  }),
  picture: Joi.string()
  .uri({ scheme: [/https?/] })
  .required()
  .messages({
    'string.base': 'Vehicle picture should be a type of string',
    'string.empty': 'Vehicle picture cannot be empty',
    'string.uri': 'Vehicle picture must be a valid URL',
    'any.required': 'Vehicle picture is a required field',
  }),
});


const vehicleValidators = {
    vehicleDetails,
};

export default vehicleValidators;