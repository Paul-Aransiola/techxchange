import { Response, Request, NextFunction } from 'express';

import { decrypt } from '../../utils/util/cryptography';
import { ROLES } from '../../utils/util/constants';
import { userModel } from '../../database/models';
import logger from '../../utils/util/logger';

export const authorizeMiddleware = (userRole: ROLES[]) => async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string;
  if (!authHeader) {
    logger.warn(`unauthorized access on ${req.path}`);
    res.status(401).json({
      success: false,
      message: 'unauthorized',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {

    const { data } = decrypt<{ data: Record<string, string> }>(token);
    const { id, role } = data;
    if (!id) {
      logger.warn(`access denied on ${req.path}`);
      res.status(401).json({
        success: false,
        message: 'access denied',
      });
      return;
    }

    const permission = await userModel
      .findOne({
        _id: id,
        role: { $in: userRole },
      })
      .lean();
    if (!permission) {
      logger.warn(`user ${id} does not have permission to access ${req.path}`);

      res.status(401).json({
        success: false,
        message: 'user does not have permission',
      });
      return;
    }

    logger.info(`user ${id} is authorized and accessing ${req.path}`);
    req.user = { id, role };
    next();
  } catch (error) {
    logger.error(`error on path ${req.path} \n ${error}`);

    res.status(400).json({
      success: false,
      message: 'Problem authorizing user, please try login in',
    });
    return;
  }
};
