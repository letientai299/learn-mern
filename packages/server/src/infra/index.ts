import express from 'express';
import winston from 'winston';
import { connectDb } from './db.js';

const ensureContext = (): express.Middleware => {
  const lg = newLogger();
  const ctx: App.Context = {
    db: connectDb(lg),
    lg: lg,
  };

  return (req, res, next) => {
    req.ctx = ctx;
    next();
  };
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

const setup = (app: express.Application) => {
  app.use(ensureContext());
};

export default {
  setup,
};
