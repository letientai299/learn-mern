import express from 'express';
import { createContext } from './context.js';
import winston from 'winston';
import { connectDb } from './db.js';

const setup = (app: express.Application) => {
  const lg = newLogger();
  const ctx = createContext({
    lg: lg,
    db: connectDb(lg),
  });
  app.use(ctx);
};

export default {
  setup,
};

const newLogger = () =>
  winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.prettyPrint({}),
      winston.format.colorize({ all: true }),
    ),
    transports: [
      new winston.transports.Console({
        forceConsole: true,
      }),
    ],
  });
