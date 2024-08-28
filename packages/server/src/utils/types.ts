import express from 'express';

export interface HttpErr {
  err: Error;
  data?: never;
}

export type IRequest<T> = express.Request<
  Record<string, string>,
  never,
  T,
  never,
  express.Locals
>;

export type IResponse<T> = express.Response<T | HttpErr, express.Locals>;
