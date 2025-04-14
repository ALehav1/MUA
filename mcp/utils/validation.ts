import { MCPMessage, MCPMessageType, ValidationResult } from '../types/mcpTypes';
import { logger } from './logger';

export function validateMCPMessage(message: MCPMessage): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate message type
  if (!message.type || !Object.values(MCPMessageType).includes(message.type)) {
    errors.push(`Invalid message type: ${message.type}`);
  }

  // Validate timestamp
  if (!message.timestamp || typeof message.timestamp !== 'number') {
    errors.push('Invalid timestamp');
  }

  // Validate source
  if (!message.source || typeof message.source !== 'string') {
    errors.push('Invalid source');
  }

  // Validate payload
  if (!message.payload) {
    warnings.push('Empty payload');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
} 