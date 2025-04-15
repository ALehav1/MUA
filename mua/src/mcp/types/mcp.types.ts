export enum MCPMessageType {
  TRACK_COMPONENT = 'TRACK_COMPONENT',
  REMOVE_COMPONENT = 'REMOVE_COMPONENT',
  TRACK_EVENT = 'TRACK_EVENT',
  TRACK_ERROR = 'TRACK_ERROR',
  TRACK_PERFORMANCE = 'TRACK_PERFORMANCE',
  GET_CONTEXT = 'GET_CONTEXT',
  UPDATE_CONTEXT = 'UPDATE_CONTEXT',
  GET_STATE = 'GET_STATE',
  UPDATE_STATE = 'UPDATE_STATE',
  GET_PLAN = 'GET_PLAN',
  UPDATE_PLAN = 'UPDATE_PLAN',
  GET_GUIDELINES = 'GET_GUIDELINES',
  UPDATE_GUIDELINES = 'UPDATE_GUIDELINES'
}

export interface MCPMessage {
  type: MCPMessageType;
  payload: any;
  timestamp: string;
  componentId?: string;
}

export interface MCPResponse {
  type: MCPMessageType;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface ComponentContext {
  id: string;
  name: string;
  type: string;
  props: Record<string, any>;
  state: Record<string, any>;
  children: string[];
  parentId?: string;
}

export interface ProjectContext {
  components: ComponentContext[];
  state: Record<string, any>;
}

export interface RepositoryState {
  components: ComponentContext[];
  state: Record<string, any>;
}

export interface MCPConfig {
  port: number;
  host: string;
  watchPaths: string[];
  maxConnections: number;
  reconnectAttempts: number;
  reconnectDelay: number;
}