import { HttpErr, IResponse } from '../utils/types.js';

export const internalErr = (res: IResponse<HttpErr>) => (err: Error) => {
  console.error(err);
  res.status(500).send({
    err: err,
  });
};
