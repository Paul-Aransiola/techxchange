import * as Joi from 'joi';

const registerUser = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    'string.base': 'First name should be a type of string',
    'string.empty': 'First name cannot be empty',
    'string.min': 'First name should have a minimum length of {#limit}',
    'string.max': 'First name should have a maximum length of {#limit}',
    'any.required': 'First name is a required field',
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Last name should be a type of string',
    'string.empty': 'Last name cannot be empty',
    'string.min': 'Last name should have a minimum length of {#limit}',
    'string.max': 'Last name should have a maximum length of {#limit}',
    'any.required': 'Last name is a required field',
  }),
  email: Joi.string().email().required().messages({
    'string.b`ase': 'Email should be a type of string',
    'string.empty': 'Email name cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is a required field',
  }),
  phoneNumber: Joi.string()
    .regex(/\+\d{3}\d{9}/)
    .required()
    .messages({
      'string.base': 'Phone number should be a type of string',
      'string.empty': 'Phone number cannot be empty',
      'string.regex': 'Phone number must be a valid phone number',
      'any.required': 'Phone number is a required field',
    }),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.base': 'Password should be a type of string',
      'string.empty': 'Password cannot be empty',
      'string.regex': 'Password must contain at least 1 special character, uppercase letter and lowercase letter',
      'string.min': 'Password should have a minimum of {#limit} characters',
      'any.required': 'password is a required field',
    }),
});


const signInUser = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email  should be a type of string',
      'string.empty': 'Email  cannot be empty',
      'string.regex': 'Email  must be a valid email ',
      'any.required': 'Email  is a required field',
    }),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.base': 'Password should be a type of string',
      'string.empty': 'Password cannot be empty',
      'string.regex': 'Password must contain at least 1 special character, uppercase letter and lowercase letter',
      'string.min': 'Password should have a minimum of {#limit} characters',
      'any.required': 'password is a required field',
    }),
});


const authenticationValidation = {
  registerUser,
  signInUser,
};



export default authenticationValidation;
