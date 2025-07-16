import winston, { format, Logger, transports as winstonTransports } from 'winston';
import LokiTransport from 'winston-loki';

const { combine, timestamp, printf, colorize, errors, json } = format;

const getLogFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const location = meta.file || 'unknown';
  const method = meta.method || 'anonymous';
  const line = meta.line || '?';
  const traceId = meta.traceId ? `[TraceID: ${meta.traceId}]` : '';
  return `${timestamp} ${traceId} ${level} [${location}:${method}:${line}] → ${stack || message}`;
});

function disableLogging(logger: Logger) {
  const noop = (() => {}) as unknown as winston.LeveledLogMethod;
  logger.info = noop;
  logger.warn = noop;
  logger.error = noop;
  logger.debug = noop;
  logger.verbose = noop;
  logger.silly = noop;
}

export function createLogger(serviceName = 'unknown'): Logger {
  const logLevel = process.env.LOG_LEVEL || 'info';
  const isSilent = logLevel === 'off';

  const logger = winston.createLogger({
    level: isSilent ? 'silent' : logLevel,
    format: combine(timestamp(), errors({ stack: true }), getLogFormat),
    transports: [],
  });

  if (!isSilent) {
    logger.add(
      new winstonTransports.Console({
        format: combine(colorize(), getLogFormat),
      })
    );

    logger.add(
      new winstonTransports.File({
        filename: 'logs/error.log',
        level: 'error',
      })
    );

    logger.add(
      new winstonTransports.File({
        filename: 'logs/combined.log',
      })
    );

    logger.add(
      new LokiTransport({
        host: 'http://localhost:3100',
        labels: { service: serviceName },
        json: true,
        format: json(),
      })
    );

    logger.exceptions.handle(
      new winstonTransports.File({ filename: 'logs/exceptions.log' })
    );
  } else {
    disableLogging(logger);
  }

  return logger;
}
