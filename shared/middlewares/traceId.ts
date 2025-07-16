import { Request, Response, NextFunction } from 'express';
import withRequestContext from '../context/requestContext';

export default function traceId(req: Request, res: Response, next: NextFunction) {
  return withRequestContext(req, res, next);
}
