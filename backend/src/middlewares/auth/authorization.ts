// src/middlewares/authorizeMiddleware.ts
import { Response, Request, NextFunction } from 'express';
import { decrypt } from '../../utils/util/cryptography';
import { ROLES } from '../../utils/util/constants';
import { userModel } from '../../database/models';
import logger from '../../utils/util/logger';

// Enhanced authorizeMiddleware
export const authorizeMiddleware = (allowedRoles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Check Authorization Header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`Unauthorized access attempt on ${req.path}`);
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
    }

    // 2. Extract and Decrypt Token
    const token = authHeader.split(' ')[1];
    try {
      const { data } = decrypt<{ data: { id: string; role: ROLES } }>(token);
      
      // 3. Validate Token Structure
      if (!data?.id || !data?.role) {
        logger.warn(`Invalid token structure on ${req.path}`);
        return res.status(401).json({
          success: false,
          message: 'Invalid token format',
        });
      }

      // 4. Verify User Exists and Has Required Role
      const user = await userModel.findOne({
        _id: data.id,
        role: { $in: allowedRoles },
      }).lean();

      if (!user) {
        logger.warn(`User ${data.id} unauthorized for ${req.path}`);
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      // 5. Attach User to Request
      req.user = {
        id: data.id,
        role: data.role,
      };

      logger.info(`User ${data.id} authorized for ${req.path}`);
      next();
    } catch (error) {
      logger.error(`Authorization error on ${req.path}: ${error}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  };
};