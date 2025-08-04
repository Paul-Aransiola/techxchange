import { Request, Response } from 'express';

import logger from '../utils/util/logger';

import { registerInputType, signInInputType } from './types/controller';
import { authenticationService } from '../services/auth';



const userRegistrationHandler = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authenticationService.registerUser(req.body as registerInputType);

    logger.info(`Registered user, ${user._id}`);
    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { user, token },
    });
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json({
      success: false,
      message: 'Registering user failed',
      error: (error as Error).message,
    });
  }
};


const userSignInHandler = async (req: Request, res: Response) => {
  try {
    const { user } = await authenticationService.signInUser(req.body as signInInputType);

    logger.info(`User signed in: ${user._id}`);
    res.status(200).json({
      success: true,
      message: 'Check your phone to complete sign-in.',
    });
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json({
      success: false,
      message: 'Sign in attempt failed',
      error: (error as Error).message,
    });
  }
};

const authenticationController = {
  userRegistrationHandler,
  userSignInHandler,
};

export default authenticationController;
