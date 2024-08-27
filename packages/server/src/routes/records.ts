import express, { RequestHandler } from "express";

import db from "../infra/db.js";
import { ObjectId } from "mongodb";

const records = express.Router();

// TODO (tai): make name unique, add some constraint, validation, type
//  safety, ...
const RECORD_COLLECTION = "records";

const validateId: RequestHandler = (req, res, next) =>
  ObjectId.isValid(req.params.id) ? next() : res.status(400).send(`Invalid id`);

records.get("/", (_, res) => {
  db.collection(RECORD_COLLECTION)
    .find()
    .toArray()
    .then((arr) => res.json(arr))
    .catch(sendInternalError(res));
});

records.get("/:id", validateId, (req, res) => {
  const id = req.params.id;
  db.collection(RECORD_COLLECTION)
    .findOne({ _id: new ObjectId(id) })
    .then((obj) =>
      obj ? res.json(obj) : res.status(404).send(`record ${id} not found`),
    )
    .catch(sendInternalError(res));
});

records.post("/", (req, res) => {
  /* eslint-disable */
  // TODO (tai): make this type safe.
  const obj = {
    name: req.body.name,
    age: req.body.age,
    createdAt: new Date(),
  };
  /* eslint-enable */

  db.collection(RECORD_COLLECTION)
    .insertOne(obj)
    .then((result) =>
      res.status(201).json({
        ...obj,
        // TODO (tai): currently, this is the only new part of the document.
        //  so it's safe to return the full object this way. What if there's
        //  some other DB generated values?
        _id: result.insertedId,
      }),
    )
    .catch(sendInternalError(res));
});

records.patch("/:id", validateId, (req, res) => {
  // TODO (tai): type safety
  /* eslint-disable */
  const obj = {
    $set: {
      name: req.body.name,
      age: req.body.age,
    },
  };
  /* eslint-enable */

  db.collection(RECORD_COLLECTION)
    .updateOne({ _id: new ObjectId(req.params.id) }, obj)
    .then((results) => res.json(results))
    .catch(sendInternalError(res));
});

records.delete("/:id", validateId, (req, res) => {
  db.collection(RECORD_COLLECTION)
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(res.json)
    .catch(sendInternalError(res));
});

const sendInternalError = (res: express.Response) => (err: Error) => {
  console.error(err);
  res.status(500).send(err);
};

export default records;
