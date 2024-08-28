import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import winston from 'winston';

const commonConnectOptions = {
  connectTimeoutMS: 1000,
  serverSelectionTimeoutMS: 1000,
};

function connectMongoose(uri: string, lg: winston.Logger) {
  mongoose
    .connect(uri, commonConnectOptions)
    .then(() => lg.info('Mongoose connected'))
    .catch((err) => {
      lg.error(`Mongoose failed to connect`);
      throw err;
    });
}

function connectDriver(uri: string, lg: winston.Logger) {
  const client = new MongoClient(uri, {
    ...commonConnectOptions,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  client
    .connect()
    .then(() => lg.info('MongoClient connected'))
    .catch((err) => {
      lg.error(`MongoClient failed to connect`);
      throw err;
    });

  return client.db('people');
}

export function connectDb(lg: winston.Logger) {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  connectMongoose(uri, lg);
  return connectDriver(uri, lg);
}
