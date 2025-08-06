import * as Joi from 'joi';


const stringValidator = (field: string, minLength = 2, maxLength = 50) =>
  Joi.string().min(minLength).max(maxLength).required().messages({
    'string.base': `${field} should be a type of string`,
    'string.empty': `${field} cannot be empty`,
    'string.min': `${field} should have a minimum length of {#limit}`,
    'string.max': `${field} should have a maximum length of {#limit}`,
    'any.required': `${field} is a required field`,
  });


const AddressValidator = Joi.object({
  location: Joi.string().allow(null).optional().messages({
    'string.base': 'location should be a type of string',
  }),
  city: Joi.string().allow(null).optional().messages({
    'string.base': 'city should be a type of string',
  }),
  state: Joi.string().allow(null).optional().messages({
    'string.base': 'state should be a type of string',
  }),
}).optional();



const BankDetailsValidator = Joi.object({
  bankName: Joi.string().allow(null).optional().messages({
    'string.base': 'Bank should be a type of string',
  }),
  bankCode: Joi.string().allow(null).optional().messages({
    'string.base': 'Bank code should be a type of string',
  }),
  accountName: Joi.string().allow(null).optional().messages({
    'string.base': 'Account name should be a type of string',
  }),
  accountNumber: Joi.string().allow(null).optional().messages({
    'string.base': 'Account number must be string',
  })
}).optional();



const updateSellerValidator = Joi.object({
  address: AddressValidator.allow(null).optional(),
  bankDetails:  BankDetailsValidator.allow(null).optional
});



const sellerValidators = {
  updateSellerValidator,
  BankDetailsValidator,
};


export default sellerValidators;
