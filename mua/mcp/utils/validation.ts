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

  // Check required fields
  if (!message.type) {
    errors.push('Message type is required');
  }

  if (!message.payload) {
    errors.push('Message payload is required');
  }

  // Validate based on message type
  switch (message.type) {
    case MCPMessageType.FILE_MODIFIED:
      if (!message.payload.filePath) {
        errors.push('File path is required for FILE_MODIFIED messages');
      }
      break;
    case MCPMessageType.COMPONENT_ADDED:
      if (!message.payload.componentName) {
        errors.push('Component name is required for COMPONENT_ADDED messages');
      }
      if (!message.payload.filePath) {
        errors.push('File path is required for COMPONENT_ADDED messages');
      }
      if (!Array.isArray(message.payload.dependencies)) {
        errors.push('Dependencies must be an array for COMPONENT_ADDED messages');
      }
      break;
    case MCPMessageType.DIRECTORY_CHANGED:
      if (!message.payload.directoryPath) {
        errors.push('Directory path is required for DIRECTORY_CHANGED messages');
      }
      break;
    case MCPMessageType.PROJECT_STRUCTURE:
      if (!message.payload.structure) {
        errors.push('Project structure is required for PROJECT_STRUCTURE messages');
      }
      break;
    case MCPMessageType.ERROR:
      if (!message.payload.error) {
        errors.push('Error details are required for ERROR messages');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

export const validateProjectStructureData = (structure: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!structure) {
    errors.push('Project structure is required');
    return { isValid: false, errors, warnings };
  }

  if (!structure.components) {
    errors.push('Components section is required in project structure');
  }

  if (!structure.dependencies) {
    warnings.push('Dependencies section is missing in project structure');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateProjectStructureObject = (structure: any): ValidationResult => {
  const errors: string[] = [];

  if (!structure || typeof structure !== 'object') {
    errors.push('Project structure must be an object');
    return { isValid: false, errors };
  }

  if (!structure.components || !Array.isArray(structure.components)) {
    errors.push('Project structure must have a components array');
  }

  if (!structure.dependencies || typeof structure.dependencies !== 'object') {
    errors.push('Project structure must have a dependencies object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 
