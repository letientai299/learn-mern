import express from 'express';
import db from './db.js';
import winston from 'winston';

const ensureContext: express.Middleware = (req, res, next) => {
  req.ctx = {
    db: db,
    lg: newLogger(),
  };
  next();
};

const newLogger = () =>
  winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.prettyPrint({ colorize: true }),
    ),
    transports: [
      new winston.transports.Console({
        forceConsole: true,
      }),
    ],
  });

const setup = (app: express.Application) => {
  app.use(ensureContext);
};

export default {
  setup,
};
