import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import withRequestContext from './utils/requestContext';
import { log } from './utils/log';
import { metricsEndpoint, metricsMiddleware } from './utils/metrics';
import { prewarmSystem } from './utils/wrampus';

const app = express();

app.use(cors());
app.use(express.json());
app.use(withRequestContext);
app.use(metricsMiddleware);

app.get('/metrics', metricsEndpoint);

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    log.http(req, res, duration);
  });

  next();
});

prewarmSystem().catch(err => {
  console.error('🔥 Prewarm failed:', err);
});

app.get('/health', (_req, res) => res.status(200).send('OK'));

app.use('/api/auth', authRoutes);

console.log('Logger Level:', process.env.LOG_LEVEL);


export default app;
