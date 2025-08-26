import mongoose from 'mongoose';

import logger from '../utils/util/logger';

export const mongooseTransaction = async <T>(callback: (session: mongoose.ClientSession) => T): Promise<T> => {
  // Skip transactions in test environment to avoid MongoDB Memory Server issues
  if (process.env.NODE_ENV === 'test') {
    // Create a fake session that supports the operations used in the codebase
    const fakeSession = {
      inTransaction: () => false,
      startTransaction: () => {},
      commitTransaction: () => Promise.resolve(),
      abortTransaction: () => Promise.resolve(),
      endSession: () => {}
    } as mongoose.ClientSession;
    
    return await callback(fakeSession);
  }

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
