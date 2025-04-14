export interface MCPServerState {
  components: Map<string, ComponentNode>;
  interactions: UserInteraction[];
  dataFlows: DataFlow[];
  performanceMetrics: PerformanceMetric[];
}

export interface ComponentNode {
  id: string;
  name: string;
  filePath: string;
  children: string[];
  props: Record<string, any>;
  state: Record<string, any>;
}

export interface UserInteraction {
  id: string;
  type: string;
  componentId: string;
  timestamp: number;
  details: Record<string, any>;
}

export interface DataFlow {
  id: string;
  source: string;
  target: string;
  type: string;
  data: any;
  timestamp: number;
}

export interface PerformanceMetric {
  id: string;
  componentId: string;
  metric: string;
  value: number;
  timestamp: number;
}

export interface MCPConfig {
  projectRoot: string;
  documentationPath: string;
  validationRules: {
    requiredDirectories: string[];
    requiredFiles: string[];
    directoryRules: {
      [key: string]: {
        requiredFiles?: string[];
        allowedExtensions?: string[];
      };
    };
  };
  maxActionLogSize: number;
}

export enum MCPMessageType {
  ERROR = 'ERROR',
  STATE_UPDATE = 'STATE_UPDATE',
  COMPONENT_ADDED = 'COMPONENT_ADDED',
  PERFORMANCE = 'PERFORMANCE',
  STATE_CHANGE = 'STATE_CHANGE',
  GET_STATE = 'GET_STATE'
}

export interface MCPMessage {
  type: MCPMessageType;
  payload: any;
  timestamp: string;
  source: string;
}

export interface ComponentAddedPayload {
  componentName: string;
  filePath: string;
  dependencies: string[];
  timestamp: string;
}

export interface PerformancePayload {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateTime: number;
  timestamp: string;
}

export interface StateChangePayload {
  componentName: string;
  stateKey: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
} 