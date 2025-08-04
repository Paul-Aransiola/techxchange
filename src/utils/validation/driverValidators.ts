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
  latitude: Joi.string().allow(null).optional().messages({
    'string.base': 'Latitude should be a type of string',
  }),
  longitude: Joi.string().allow(null).optional().messages({
    'string.base': 'Longitude should be a type of string',
  }),
  place: Joi.string().allow(null).optional().messages({
    'string.base': 'Place should be a type of string',
  }),
}).optional();


const DriverEmergencyContactValidator = Joi.object({
  phoneNumber: Joi.string().pattern(/\+\d{3}\d{9}/).required().messages({
    'string.base': 'Phone number should be a type of string',
    'string.empty': 'Phone number cannot be empty',
    'string.pattern.base': 'Phone number must be a valid phone number',
    'any.required': 'Phone number is a required field',
  }),
  address: AddressValidator.allow(null).optional(), 
});


const DriverBankDetailsValidator = Joi.object({
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



const createDriverValidator = Joi.object({
  dob: Joi.date().less('now').required().messages({
    'date.base': 'Date of birth should be a valid date',
    'date.less': 'Date of birth must be a date in the past',
    'any.required': 'Date of birth is a required field',
  }),
  city: stringValidator('city'),
  state: stringValidator('state'),
  address: AddressValidator.allow(null).optional(),
  emergencyContact: DriverEmergencyContactValidator, 
});


const updateDriverValidator = Joi.object({
  dob: Joi.date().less('now').optional().messages({
    'date.base': 'Date of birth should be a valid date',
    'date.less': 'Date of birth must be a date in the past',
  }),
  city: stringValidator('City').optional(),
  state: stringValidator('State').optional(),
  address: AddressValidator.allow(null).optional(),
  emergencyContact: DriverEmergencyContactValidator, // Optional nested emergency contact
});



const driverValidators = {
  createDriverValidator,
  updateDriverValidator,
  DriverEmergencyContactValidator,
  DriverBankDetailsValidator,
};


export default driverValidators;
