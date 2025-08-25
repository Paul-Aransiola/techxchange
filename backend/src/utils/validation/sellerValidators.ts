import * as Joi from 'joi';

// 1. Address Schema (Simplified and Strict)
const AddressValidator = Joi.object({
  location: Joi.string().optional().messages({
    'string.base': 'Location must be a string',
  }),
  city: Joi.string().optional().messages({
    'string.base': 'City must be a string',
  }),
  state: Joi.string().optional().messages({
    'string.base': 'State must be a string',
  }),
}).optional(); // `.allow(null)` is redundant with `.optional()`

// 2. Bank Details Schema (Fixed Typo)
const BankDetailsValidator = Joi.object({
  bankName: Joi.string().optional().messages({
    'string.base': 'Bank name must be a string',
  }),
  bankCode: Joi.string().optional().messages({
    'string.base': 'Bank code must be a string',
  }),
  accountName: Joi.string().optional().messages({
    'string.base': 'Account name must be a string',
  }),
  accountNumber: Joi.string().optional().messages({
    'string.base': 'Account number must be a string',
  }),
}).optional();

// 3. Update Seller Schema (Fixed Syntax Error)
const updateSellerValidator = Joi.object({
  address: AddressValidator,
  bankDetails: BankDetailsValidator, 
});

// 4. Export Validators
export default {
  updateSellerValidator,
};