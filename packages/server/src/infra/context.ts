import express from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';

const ctxStore = new AsyncLocalStorage();

export const ctxLg = () => (ctxStore.getStore() as App.Context)?.lg;

export const createContext =
  (ctx: App.Context): express.Middleware =>
  (req, _, next) => {
    req.ctx = ctx;
    ctxStore.run(ctx, next);
  };
