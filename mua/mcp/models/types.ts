export interface ProjectContext {
  components: Map<string, any>;
  dependencies: Map<string, string>;
  documentation: Map<string, string>;
}

export interface RepositoryState {
  lastCommit: string;
  branch: string;
  status: 'clean' | 'dirty';
}

export interface ActionLog {
  timestamp: string;
  action: string;
  details: any;
}

export interface ValidationRule {
  type: 'fileSize' | 'extensions';
  value: number | string[];
}

export interface MCPConfig {
  validationRules: ValidationRule[];
  logLevel: 'info' | 'warn' | 'error';
  autoSave: boolean;
  backupInterval: number;
}

export interface DocumentationChange {
  file: string;
  type: 'added' | 'modified' | 'deleted';
  timestamp: string;
  summary: string;
}

export interface ComponentDependency {
  name: string;
  version: string;
  type: 'production' | 'development';
  description: string;
} 