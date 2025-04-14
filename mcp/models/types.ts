export interface ProjectContext {
  components: Map<string, ComponentContext>;
  dependencies: Map<string, DependencyContext>;
  documentation: Map<string, string>;
  tests: Map<string, string>;
  config: ProjectConfig;
  lastUpdated: number;
}

export interface ComponentContext {
  name: string;
  filePath: string;
  dependencies: string[];
  props: Record<string, any>;
  state: Record<string, any>;
}

export interface DependencyContext {
  name: string;
  version: string;
  type: string;
}

export interface ProjectConfig {
  projectRoot: string;
  validationRules: ValidationRule[];
  directoryRequirements: DirectoryRequirement[];
}

export interface ValidationRule {
  action: string;
  validate: (payload: Record<string, any>, context: ProjectContext) => boolean;
  errorMessage: string;
}

export interface DirectoryRequirement {
  path: string;
  required: boolean;
  description: string;
}

export interface MCPMessage {
  type: MCPMessageType;
  timestamp: string;
  source: string;
  payload: any;
}

export type MCPMessageType = 
  | 'FILE_MODIFIED'
  | 'COMPONENT_ADDED'
  | 'COMPONENT_REMOVED'
  | 'STATE_CHANGED'
  | 'USER_INTERACTION'
  | 'DATA_FLOW'
  | 'PERFORMANCE_METRIC';

export interface ActionPayloads {
  FILE_MODIFIED: {
    filePath: string;
    changes: string[];
  };
  COMPONENT_ADDED: {
    componentName: string;
    location: string;
    dependencies: string[];
  };
  COMPONENT_REMOVED: {
    componentName: string;
  };
  STATE_CHANGED: {
    componentName: string;
    state: Record<string, any>;
  };
  USER_INTERACTION: {
    componentName: string;
    interaction: string;
    details: Record<string, any>;
  };
  DATA_FLOW: {
    source: string;
    target: string;
    data: any;
  };
  PERFORMANCE_METRIC: {
    componentName: string;
    metric: string;
    value: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface DocumentationContext {
  file: string;
  type: 'added' | 'modified' | 'deleted';
  summary: string;
}

export interface TestContext {
  filePath: string;
  testType: 'unit' | 'integration' | 'e2e';
  coverage: number;
}

export interface ConfigContext {
  file: string;
  changes: Record<string, any>;
}

export interface RepositoryState {
  lastCommit: string;
  branch: string;
  changes: string[];
}

export interface ActionLog {
  id: string;
  type: string;
  timestamp: number;
  payload: unknown;
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