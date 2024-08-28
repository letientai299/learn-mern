import express, { RequestHandler } from 'express';
import { ObjectId } from 'mongodb';

import { HttpErr, IRequest, IResponse } from '../utils/types.js';
import mw from '../middlewares/index.js';
import person, { Person, PersonInput } from '../models/person.js';

const recordRoutes = express.Router();

// TODO (tai): make name unique, add some constraint, validation, type
//  safety, ...
const RECORD_COLLECTION = 'records';

const validateId: RequestHandler = (req, res, next) =>
  ObjectId.isValid(req.params.id)
    ? next()
    : res.status(400).send(`Invalid id ${req.params.id}`);

recordRoutes.get('/', (req, res) => {
  req.ctx.db
    .collection(RECORD_COLLECTION)
    .find()
    .toArray()
    .then((arr) => res.json(arr))
    .catch(internalErr(res));
});

recordRoutes.get('/:id', validateId, (req, res) => {
  const id = req.params.id;
  req.ctx.db
    .collection(RECORD_COLLECTION)
    .findOne({ _id: new ObjectId(id) })
    .then((obj) =>
      obj ? res.json(obj) : res.status(404).send(`record ${id} not found`),
    )
    .catch(internalErr(res));
});

recordRoutes.post(
  '/',
  mw.checkBody(person.Input),
  (req: IRequest<PersonInput>, res: IResponse<Person>) => {
    const obj = {
      name: req.body.name,
      age: req.body.age,
    };

    req.ctx.db
      .collection(RECORD_COLLECTION)
      .insertOne(obj)
      .then((result) =>
        res.status(201).json({
          // TODO (tai): currently, this is the only new part of the document.
          //  so it's safe to return the full object this way. What if there's
          //  some other DB generated values?
          _id: result.insertedId,
          createAt: new Date(),
          ...obj,
        }),
      )
      .catch(internalErr(res));
  },
);

recordRoutes.patch(
  '/:id',
  validateId,
  mw.checkBody(person.Input),
  (req: IRequest<PersonInput>, res: IResponse<Person>) => {
    const query = { _id: new ObjectId(req.params.id) };
    const update = {
      $set: {
        name: req.body.name,
        age: req.body.age,
      },
    };

    req.ctx.db
      .collection(RECORD_COLLECTION)
      .updateOne(query, update)
      .then(() => res.redirect(`/${req.params.id}`))
      .catch(internalErr(res));
  },
);

recordRoutes.delete('/:id', validateId, (req, res) => {
  req.ctx.db
    .collection(RECORD_COLLECTION)
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(res.json)
    .catch(internalErr(res));
});

const internalErr = (res: IResponse<HttpErr>) => (err: Error) => {
  console.error(err);
  res.status(500).send({
    err: err,
  });
};

export default recordRoutes;
