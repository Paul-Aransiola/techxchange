import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const mongoMockServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  mongoose.connection.on('connected', () => {
    console.info('started test server');
  });

  mongoose.connection.on('error', (err) => {
    console.error('error connecting to test db', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.error('test disconnected');
  });

  return {
    stopMockDb: async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    },
    dropMockDb: async () => {
      await mongoose.connection.dropDatabase();
    },
  };
};
