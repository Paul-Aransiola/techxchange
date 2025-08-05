import mongoose from 'mongoose';

import logger from '../utils/util/logger';

export const mongooseTransaction = async <T>(callback: (session: mongoose.ClientSession) => T): Promise<T> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    logger.error('session error', { error });
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
