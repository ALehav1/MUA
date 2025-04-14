import { logger } from '../utils/logger';

export function handleError(error: unknown, context: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stackTrace = error instanceof Error ? error.stack : undefined;

  logger.error(`Error in ${context}: ${errorMessage}`);
  if (stackTrace) {
    logger.debug(`Stack trace: ${stackTrace}`);
  }
} 