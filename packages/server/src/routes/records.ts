import express, { RequestHandler } from "express";
import db from "../infra/db.js";
import { ObjectId } from "mongodb";

import { z, ZodSchema } from "zod";

type IRequest<T> = express.Request<
  Record<string, string>,
  never,
  T,
  never,
  express.Locals
>;
type IResponse<T> = express.Response<T | HttpErr, express.Locals>;

// TODO (tai): does zod has any way to deal with this linter rule?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpErrSchema = z.object({
  msg: z.string(),
  err: z.object({}).optional(),
  status: z.number().int().positive(),
});

type HttpErr = z.infer<typeof httpErrSchema>;

const recordSchema = z.object({
  _id: z.union([
    z.string().optional().default(""),
    z.custom<ObjectId>((v) => typeof v === "string" && ObjectId.isValid(v)),
  ]),
  name: z.string().min(1).max(10),
  age: z.number().int().positive().max(100),
  createAt: z.date(),
});

const recordRequestBodySchema = recordSchema.omit({
  _id: true,
  createAt: true,
});

type Person = z.infer<typeof recordSchema>;

const checkBody =
  (schema: ZodSchema) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const result = schema.safeParse(req.body);
    return result.success
      ? next()
      : res.status(400).json({ err: result.error, data: result.data });
  };

const recordRoutes = express.Router();

// TODO (tai): make name unique, add some constraint, validation, type
//  safety, ...
const RECORD_COLLECTION = "records";

const validateId: RequestHandler = (req, res, next) =>
  ObjectId.isValid(req.params.id) ? next() : res.status(400).send(`Invalid id`);

recordRoutes.get("/", (_, res) => {
  db.collection(RECORD_COLLECTION)
    .find()
    .toArray()
    .then((arr) => res.json(arr))
    .catch(sendInternalError(res));
});

recordRoutes.get("/:id", validateId, (req, res) => {
  const id = req.params.id;
  db.collection(RECORD_COLLECTION)
    .findOne({ _id: new ObjectId(id) })
    .then((obj) =>
      obj ? res.json(obj) : res.status(404).send(`record ${id} not found`),
    )
    .catch(sendInternalError(res));
});

recordRoutes.post(
  "/",
  checkBody(recordRequestBodySchema),
  (req: IRequest<Person>, res: IResponse<Person>) => {
    const obj = {
      name: req.body.name,
      age: req.body.age,
    };

    db.collection(RECORD_COLLECTION)
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
      .catch(sendInternalError(res));
  },
);

recordRoutes.patch(
  "/:id",
  validateId,
  checkBody(recordRequestBodySchema),
  (req: IRequest<Person>, res: IResponse<Person>) => {
    const query = { _id: new ObjectId(req.params.id) };
    const update = {
      $set: {
        name: req.body.name,
        age: req.body.age,
      },
    };

    db.collection(RECORD_COLLECTION)
      .updateOne(query, update)
      .then(() => res.redirect(`/${req.params.id}`))
      .catch(sendInternalError(res));
  },
);

recordRoutes.delete("/:id", validateId, (req, res) => {
  db.collection(RECORD_COLLECTION)
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(res.json)
    .catch(sendInternalError(res));
});

const sendInternalError = (res: IResponse<HttpErr>) => (err: Error) => {
  console.error(err);
  res.status(500).send({
    err: err,
    msg: "Internal server error",
    status: 500,
  });
};

export default recordRoutes;
