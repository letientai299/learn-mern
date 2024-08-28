import { ZodSchema } from 'zod';
import { IRequest, IResponse } from '../utils/types.js';
import { RequestHandler } from 'express';
import { ObjectId } from 'mongodb';

function checkBody<I, O>(schema: ZodSchema) {
  return (req: IRequest<I>, res: IResponse<O>, next: () => void) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      return next();
    }
    res.status(400).json({ err: result.error, data: result.data });
  };
}

const objectId: RequestHandler = (req, res, next) =>
  ObjectId.isValid(req.params.id)
    ? next()
    : res.status(400).send(`Invalid id ${req.params.id}`);

const Index = {
  Body: checkBody,
  Path: {
    Params: { ObjectId: objectId },
  },
};

export default Index;
