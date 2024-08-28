import { ZodSchema } from 'zod';
import { IRequest, IResponse } from '../utils/types.js';

export function checkBody<I, O>(schema: ZodSchema) {
  return (req: IRequest<I>, res: IResponse<O>, next: () => void) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      return next();
    }
    res.status(400).json({ err: result.error, data: result.data });
  };
}
