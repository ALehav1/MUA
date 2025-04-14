import { logger } from '../utils/logger';

export function handleError(error: unknown, context?: string): Error {
  const err = error instanceof Error ? error : new Error(String(error));
  const message = context ? `${context}: ${err.message}` : err.message;
  logger.error(message);
  return err;
} 