export enum MODELS {
  USER = 'user',
  SELLER = 'seller',
  PRODUCT = 'product',
  REVIEW = 'review'
}

export enum ROLES {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export const ROLES_TYPE = Object.freeze(ROLES);

export enum MESSAGE_TYPES {
  ERROR = 'error',
  SUCCESS = 'success',
}
