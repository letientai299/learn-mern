import express from 'express';
import { z } from 'zod';

// TODO (tai): does zod has any way to deal with this linter rule?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpErrSchema = z.object({
  err: z.object({}).optional(),
  data: z.unknown(),
});

export type HttpErr = z.infer<typeof httpErrSchema>;

export type IRequest<T> = express.Request<
  Record<string, string>,
  never,
  T,
  never,
  express.Locals
>;

export type IResponse<T> = express.Response<T | HttpErr, express.Locals>;
