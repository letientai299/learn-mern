import express from 'express';
import { Cars } from '../models/cars.js';
import { internalErr } from './err.js';
import Validate from '../validate/index.js';

const routes = express.Router();

routes.get('/', (req, res) => {
  Cars.find()
    // NOTE: this doesn't work
    // .then(res.json)
    .then((v) => res.json(v))
    .catch(internalErr(res));
});

routes.get('/:id', Validate.Path.Params.ObjectId, (req, res) => {
  Cars.findById(req.params.id)
    .then((v) => res.json(v))
    .catch(internalErr(res));
});

routes.post('/', (req, res) => {
  Cars.create(req.body)
    .then((v) => res.json(v))
    .catch(internalErr(res));
});

export default routes;
