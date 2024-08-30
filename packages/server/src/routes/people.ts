import express from 'express';
import { ObjectId } from 'mongodb';

import { IRequest, IResponse } from '../utils/types.js';
import person, { Person, PersonInput } from '../models/person.js';
import Index from '../validate/index.js';
import { internalErr } from './err.js';

const routes = express.Router();

const COLLECTION = 'people';

routes.get('/', (req, res) => {
  req.ctx.db
    .collection(COLLECTION)
    .find()
    .toArray()
    .then((arr) => res.json(arr))
    .catch(internalErr(res));
});

routes.get('/:id', Index.Path.Params.ObjectId, (req, res) => {
  const id = req.params.id;
  req.ctx.db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) })
    .then((obj) =>
      obj ? res.json(obj) : res.status(404).send(`Person with ${id} not found`),
    )
    .catch(internalErr(res));
});

routes.post(
  '/',
  Index.Body(person.Input),
  (req: IRequest<PersonInput>, res: IResponse<Person>) => {
    const obj = {
      name: req.body.name,
      age: req.body.age,
    };

    req.ctx.db
      .collection(COLLECTION)
      .insertOne(obj)
      .then((result) =>
        res.status(201).json({
          // NOTE: currently, this is the only new part of the document. so it's
          //  safe to return the full object this way. What if there's some
          //  other DB generated values?
          _id: result.insertedId,
          createAt: new Date(),
          ...obj,
        }),
      )
      .catch(internalErr(res));
  },
);

routes.patch(
  '/:id',
  Index.Path.Params.ObjectId,
  Index.Body(person.Input),
  (req: IRequest<PersonInput>, res: IResponse<Person>) => {
    const query = { _id: new ObjectId(req.params.id) };
    const update = {
      $set: {
        name: req.body.name,
        age: req.body.age,
      },
    };

    req.ctx.db
      .collection(COLLECTION)
      .updateOne(query, update)
      .then(() => res.redirect(`/${req.params.id}`))
      .catch(internalErr(res));
  },
);

routes.delete('/:id', Index.Path.Params.ObjectId, (req, res) => {
  req.ctx.db
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(res.json.bind(res))
    .catch(internalErr(res));
});

export default routes;
