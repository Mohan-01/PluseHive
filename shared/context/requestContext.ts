import { createNamespace, Namespace } from 'cls-hooked';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export type RequestContext = {
  traceId: string;
  method: string;
  path: string;
};

const namespace: Namespace = createNamespace('request');

export const requestContext = {
  run<T>(context: RequestContext, callback: () => T): T {
    return namespace.runAndReturn(() => {
      namespace.set('context', context);
      return callback();
    });
  },
  getStore(): RequestContext | undefined {
    return namespace.get('context');
  },
};

export function getTraceId(): string {
  const ctx = requestContext.getStore();
  return ctx ? ctx.traceId : '';
}

export default function withRequestContext(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const context: RequestContext = {
    traceId: (req.headers['x-trace-id'] as string) || uuidv4(),
    method: req.method,
    path: req.path,
  };

  requestContext.run(context, () => next());
}

export function runWithContext(ctx: RequestContext, fn: () => Promise<void> | void) {
  return requestContext.run(ctx, fn);
}
