export enum MCPMessageType {
  FILE_MODIFIED = 'FILE_MODIFIED',
  COMPONENT_ADDED = 'COMPONENT_ADDED',
  DEPENDENCY_ADDED = 'DEPENDENCY_ADDED',
  DOCUMENTATION_UPDATED = 'DOCUMENTATION_UPDATED',
  TEST_ADDED = 'TEST_ADDED',
  CONFIG_CHANGED = 'CONFIG_CHANGED',
  INITIAL_STATE_VALIDATION = 'INITIAL_STATE_VALIDATION'
}

export interface MCPMessage {
  type: MCPMessageType;
  payload: any;
  timestamp: number;
  source: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
} 