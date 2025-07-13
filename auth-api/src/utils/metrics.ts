import { NextFunction, Request, Response } from 'express';
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Collects CPU, memory, event loop, etc.

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5] // Customize based on needs
});

export const httpRequestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode.toString()
    };

    httpRequestCount.inc(labels);
    end(labels);
  });

  next();
};

export async function metricsEndpoint(req: Request, res: Response) {
   try {
    const metrics = await client.register.metrics();
    res.setHeader('Content-Type', client.register.contentType);
    res.end(metrics);
  } catch (err) {
    res.status(500).send('Error generating metrics');
  }
};
