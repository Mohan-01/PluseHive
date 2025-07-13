import { Request, Response } from 'express';
import logger from './logger';
import { getLogLocation } from './logHelper';
import { getTraceId } from './requestContext';

export const log = {
  info: (msg: string) => logger.info(msg, { ...getLogLocation(), traceId: getTraceId() }),
  error: (msg: string | Error) =>
  logger.error(msg instanceof Error ? msg.stack ?? msg.message : msg, {
    ...getLogLocation(),
    traceId: getTraceId()
  }),
  debug: (msg: string) => logger.debug(msg, { ...getLogLocation(), traceId: getTraceId() }),
  warn: (msg: string) => logger.warn(msg, { ...getLogLocation(), traceId: getTraceId() }),
  http: (req: Request, res: Response, duration: number) =>
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      ...getLogLocation(),
      traceId: getTraceId()
    }),
};
