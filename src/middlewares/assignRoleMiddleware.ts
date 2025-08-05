import { Response, Request, NextFunction } from 'express';

import { ROLES } from '../utils/util/constants';
import logger from '../utils/util/logger';

export const assignRoleMiddleware = (role: ROLES) => async (req: Request, res: Response, next: NextFunction) => {
  req.body.role = role;
  logger.info(`Role ${role} assigned to user`);
  next();
};
