import { MCPMessage, MCPMessageType } from '../types/mcp.types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateMCPMessage(message: any): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!message.type) {
    errors.push('Message type is required');
  }

  if (!message.timestamp) {
    errors.push('Timestamp is required');
  }

  if (!message.payload) {
    errors.push('Payload is required');
  }

  // Validate message type
  if (message.type && !Object.values(MCPMessageType).includes(message.type)) {
    errors.push(`Invalid message type: ${message.type}`);
  }

  // Validate timestamp format
  if (message.timestamp && !isValidISODate(message.timestamp)) {
    errors.push('Invalid timestamp format');
  }

  // Validate payload based on message type
  if (message.type && message.payload) {
    switch (message.type) {
      case MCPMessageType.TRACK_COMPONENT:
        if (!message.payload.id) {
          errors.push('Component ID is required for TRACK_COMPONENT');
        }
        if (!message.payload.name) {
          errors.push('Component name is required for TRACK_COMPONENT');
        }
        break;
      case MCPMessageType.UPDATE_CONTEXT:
        if (!message.payload.components && !message.payload.state) {
          errors.push('Either components or state must be provided for UPDATE_CONTEXT');
        }
        break;
      case MCPMessageType.UPDATE_STATE:
        if (!message.payload.components && !message.payload.state) {
          errors.push('Either components or state must be provided for UPDATE_STATE');
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString();
} 