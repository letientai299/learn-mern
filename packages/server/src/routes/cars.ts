import express from 'express';
import { Cars } from '../models/cars.js';
import { internalErr } from './err.js';
import Validate from '../validate/index.js';
import { getRequestId } from '../middlewares/request_id.js';
import mongoose from 'mongoose';

const routes = express.Router();

routes.get('/', (req, res) => {
  req.ctx.lg.debug('get call cars');
  Cars.find({ $comment: getRequestId(req) })
    // NOTE: this doesn't work
    // .then(res.json)
    .then((v) => res.json(v))
    .catch(internalErr(res));
});

routes.get('/:id', Validate.Path.Params.ObjectId, (req, res) => {
  req.ctx.lg.debug('get a single car');
  Cars.findById(req.params.id)
    .then((v) => res.json(v))
    .catch(internalErr(res));
});

routes.post('/', (req, res) => {
  mongoose
    .startSession()
    // TODO (tai): continue working on this function
    .then((ss) => ss.withTransaction(() => Cars.create({})))
    .catch(internalErr(res));

  Cars.create(req.body)
    .then((v) => res.json(v))
    .catch(internalErr(res));
});

export default routes;
