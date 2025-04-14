export enum MCPMessageType {
  COMPONENT_ADDED = 'COMPONENT_ADDED',
  STATE_UPDATED = 'STATE_UPDATED',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface MCPMessage {
  type: MCPMessageType;
  payload: any;
  timestamp: string;
  source?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface ProjectContext {
  components: Record<string, {
    filePath: string;
    dependencies: string[];
  }>;
  state: Record<string, any>;
  actionLog: ActionLog[];
}

export interface ActionLog {
  timestamp: string;
  action: string;
  details: any;
}

export interface RepositoryState {
  components: Record<string, {
    filePath: string;
    dependencies: string[];
  }>;
  state: Record<string, any>;
  lastUpdated: string;
}

export interface MCPConfig {
  port: number;
  validationRules: ValidationRule[];
  logLevel: 'info' | 'warn' | 'error' | 'debug';
  autoSave: boolean;
  backupInterval: number;
}

export interface ValidationRule {
  type: string;
  validate: (data: any) => ValidationResult;
} 