import { ValidationResult, MCPMessage, MCPMessageType } from '../types/mcpTypes';
import fs from 'fs';
import path from 'path';

export const validateProjectStructure = async (): Promise<ValidationResult> => {
  const requiredDirs = ['src', 'mcp', 'docs'];
  const requiredFiles = ['README.md', 'plan.md', 'Dependencies.md', 'Project_tracking.md'];
  
  const errors: string[] = [];

  // Check required directories
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      errors.push(`Missing required directory: ${dir}`);
    }
  }

  // Check required files
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

export const validateMCPMessage = (message: MCPMessage): ValidationResult => {
  const errors: string[] = [];

  if (!message.type || !Object.values(MCPMessageType).includes(message.type)) {
    errors.push('Invalid message type');
  }

  if (!message.payload) {
    errors.push('Missing payload');
  }

  if (!message.timestamp || typeof message.timestamp !== 'number') {
    errors.push('Invalid timestamp');
  }

  if (!message.source || !['client', 'server'].includes(message.source)) {
    errors.push('Invalid source');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

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
