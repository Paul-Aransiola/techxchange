import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from '../../config';

interface JwtPayload {
  data: unknown;
}

interface EncryptOptions {
  expiresIn?: number | `${number}${'ms'|'s'|'m'|'h'|'d'|'y'}`;
  data: unknown;
}

const SECRET = JWT_SECRET as jwt.Secret;
if (!SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const decrypt = <T = JwtPayload>(token: string): T => {
  if (!token) throw new Error("Invalid token");
  return jwt.verify(token, SECRET) as T;
};

export const encrypt = (options: EncryptOptions): string => {
  const { expiresIn, data } = options;
  
  // Type-safe payload construction
  const payload: string | object | Buffer = { data };
  
  if (expiresIn !== undefined) {
    // Create options with properly typed expiresIn
    const options: jwt.SignOptions = {
      expiresIn: expiresIn
    };
    return jwt.sign(payload, SECRET, options);
  }
  
  return jwt.sign(payload, SECRET);
};