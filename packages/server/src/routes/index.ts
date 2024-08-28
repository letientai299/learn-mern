import people from './people.js';
import cars from './cars.js';
import express from 'express';

function setup(app: express.Application) {
  app.use('/people', people);
  app.use('/cars', cars);
}

export default {
  setup,
};
