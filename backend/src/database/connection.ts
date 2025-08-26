import mongoose from 'mongoose';
import { MONGO_URI, MONGO_DB_NAME } from '../config'

const mongoConnectionInit = () => {
 
  mongoose
    .connect(`${MONGO_URI}/${MONGO_DB_NAME}`)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: Error) => console.error('MongoDB connection error:', err));

  mongoose.connection.on('connected', () => {
    // remember to remove console.logs and replace them with logger
    console.log('connected to db on: ', MONGO_URI);
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error: ' + err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });

  // Close the connection when the app terminates
  process.on('SIGINT', () => {
    mongoose.connection
      .close(true)
      .then(() => {
        console.log('Mongoose disconnected through app termination');
        throw new Error('Db terminated');
      })
      .catch((error: Error) => {
        console.error(`Error terminating mongodb. \n ${error}`);
      });
  });
};

export default mongoConnectionInit;
