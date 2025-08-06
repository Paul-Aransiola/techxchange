import * as Joi from 'joi';

const productDetails = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Product name should be a type of string',
    'string.empty': 'Product name cannot be empty',
    'string.min': 'Product name should have a minimum length of {#limit}',
    'string.max': 'Product name should have a maximum length of {#limit}',
    'any.required': 'Product name is a required field',
  }),
  category: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Product category should be a type of string',
    'string.empty': 'Product category cannot be empty',
    'string.min': 'Product category should have a minimum length of {#limit}',
    'string.max': 'Product category should have a maximum length of {#limit}',
    'any.required': 'Product category is a required field',
  }),
  description: Joi.string().min(10).max(430).required().messages({
    'string.base': 'Product description should be a type of string',
    'string.empty': 'Product description cannot be empty',
    'string.min': 'Product description should have a minimum length of {#limit}',
    'string.max': 'Product description should have a maximum length of {#limit}',
    'any.required': 'Product description is a required field',
  }),
 
  price: Joi.number().greater(0).required().messages({
    'number.base': 'Product price should be a type of number',
    'number.greater': 'Product price must be greater than 0',
    'any.required': 'Product price is a required field',
  })
});


const productValidators = {
  productDetails,
};

export default productValidators;