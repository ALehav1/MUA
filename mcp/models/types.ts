export interface ProjectContext {
  projectName: string;
  currentPhase: string;
  lastUpdated: string;
  activeComponents: string[];
  dependencies: Record<string, string>;
  documentation: {
    plan: string;
    dependencies: string;
    tracking: string;
  };
}

export interface RepositoryState {
  lastCommit: string;
  currentBranch: string;
  modifiedFiles: string[];
  stagedChanges: string[];
  untrackedFiles: string[];
}

export interface ActionLog {
  timestamp: string;
  action: string;
  payload: any;
  context: ProjectContext;
  repositoryState: RepositoryState;
}

export interface MCPConfig {
  projectRoot: string;
  documentationPath: string;
  maxActionLogSize: number;
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  action: string;
  validate: (payload: any, context: ProjectContext) => boolean;
  errorMessage: string;
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