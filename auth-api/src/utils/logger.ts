import winston, { format, Logger, transports as winstonTransports } from 'winston';
import LokiTransport from 'winston-loki';

const { combine, timestamp, printf, colorize, errors, json } = format;

// Load and check log level
const logLevel = process.env.LOG_LEVEL || 'info';
const isSilent = logLevel === 'off';

// -------------------------
// Formatter for logs
// -------------------------
const getLogFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const location = meta.file || 'unknown';
  const method = meta.method || 'anonymous';
  const line = meta.line || '?';
  const traceId = meta.traceId ? `[TraceID: ${meta.traceId}]` : '';
  return `${timestamp} ${traceId} ${level} [${location}:${method}:${line}] → ${stack || message}`;
});

// -------------------------
// No-op override to disable logs completely
// -------------------------
function disableLogging(logger: Logger) {
  const noop = (() => {}) as unknown as winston.LeveledLogMethod;
  logger.info = noop;
  logger.warn = noop;
  logger.error = noop;
  logger.debug = noop;
  logger.verbose = noop;
  logger.silly = noop;
}

// -------------------------
// Initialize logger (no transports yet)
// -------------------------
const logger = winston.createLogger({
  level: isSilent ? 'silent' : logLevel,
  format: combine(
    timestamp(),
    errors({ stack: true }),
    getLogFormat
  ),
  transports: [], // will be added below
});

// -------------------------
// Attach transports only if not silent
// -------------------------
if (!isSilent) {
  logger.add(new winstonTransports.Console({
    format: combine(colorize(), getLogFormat),
  }));

  logger.add(new winstonTransports.File({
    filename: 'logs/error.log',
    level: 'error',
  }));

  logger.add(new winstonTransports.File({
    filename: 'logs/combined.log',
  }));

  logger.add(new LokiTransport({
    host: 'http://localhost:3100',
    labels: { service: 'auth-api' },
    json: true,
    format: json(),
  }));

  logger.exceptions.handle(
    new winstonTransports.File({ filename: 'logs/exceptions.log' })
  );
} else {
  disableLogging(logger); // prevents memory warnings
}

export default logger;
