import { MCPMessage, MCPMessageType, ValidationResult } from '../types/mcpTypes';

export function validateMCPMessage(message: MCPMessage): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!message.type || !Object.values(MCPMessageType).includes(message.type)) {
    errors.push('Invalid message type');
  }

  if (!message.payload) {
    errors.push('Missing payload');
  }

  if (!message.timestamp || typeof message.timestamp !== 'number') {
    errors.push('Invalid timestamp');

  }

  if (!message.source) {
    warnings.push('Missing source information');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
} } 
