export enum MCPMessageType {
  COMPONENT_ADDED = 'COMPONENT_ADDED',
  STATE_UPDATED = 'STATE_UPDATED',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DIRECTORY_CHANGED = 'DIRECTORY_CHANGED',
  FILE_MODIFIED = 'FILE_MODIFIED',
  DEPENDENCY_ADDED = 'DEPENDENCY_ADDED',
  DOCUMENTATION_UPDATED = 'DOCUMENTATION_UPDATED',
  TEST_ADDED = 'TEST_ADDED',
  CONFIG_CHANGED = 'CONFIG_CHANGED',
  INITIAL_STATE_VALIDATION = 'INITIAL_STATE_VALIDATION',
  PROJECT_STRUCTURE = 'PROJECT_STRUCTURE'
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
  projectRoot: string;
}

export interface ActionLog {
  timestamp: string;
  action: string;
  details: any;
  payload?: any;
}

export interface RepositoryState {
  components: Record<string, {
    filePath: string;
    dependencies: string[];
  }>;
  state: Record<string, any>;
  lastUpdated: string;
  projectRoot: string;
}

export interface MCPConfig {
  port: number;
  validationRules: ValidationRule[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  autoSave: boolean;
  backupInterval: number;
  projectRoot: string;
}

export interface ValidationRule {
  type: string;
  pattern: string;
  message: string;
  action?: string;
  validate?: (payload: any, context: any) => boolean;
}

export interface DirectoryChangePayload {
  oldPath?: string;
  newPath?: string;
  type: 'created' | 'deleted';
} 