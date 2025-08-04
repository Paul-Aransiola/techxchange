export enum MODELS {
  USER = 'user',
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


export enum OTP {
  VERIFICATION = 0 as number,
  ACCESS = 1 as number,
  REFRESH = 2 as number,
  PASSWORD_RESET = 3 as number,
}

export const OTP_EXPIRY = parseInt(process.env.REDIS_OTP_EXP || '180', 10);
export const TOKEN_EXPIRY = parseInt(process.env.REDIS_TOKEN_EXP || '432000', 10);
