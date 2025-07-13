import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export type RequestContext = {
  traceId: string;
  method: string;
  path: string;
};

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getTraceId(): string {
  const context = requestContext.getStore();
  return context ? context.traceId : '';
}

export default function withRequestContext(req: Request, res: Response, next: NextFunction) {
  const context: RequestContext = {
    traceId: req.headers['x-trace-id'] as string || uuidv4(),
    method: req.method,
    path: req.path,
  };

  requestContext.run(context, () => next());
}

export function runWithContext(ctx: RequestContext, fn: () => Promise<void>) {
  return requestContext.run(ctx, fn);
}
