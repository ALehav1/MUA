import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { MCPMessage, MCPMessageType, ProjectContext, RepositoryState, MCPConfig } from '../types/mcpTypes';
import { logger } from '../utils/logger';
import { validateMCPMessage } from '../utils/validation';
import { handleMCPMessage } from '../handlers/messageHandler';
import { handleError } from '../handlers/errorHandler';
import { ValidationRule } from '../models/types';
import { validateAction, trackChanges, updateDocumentation, validateDependencies, checkComponentConsistency } from '../utils/contextUtils';
import fs from 'fs';
import { validateProjectStructure } from '../utils/validation';
import path from 'path';

// Define all possible action types
export type ActionType = 
  | 'FILE_MODIFIED'
  | 'COMPONENT_ADDED'
  | 'DEPENDENCY_ADDED'
  | 'DOCUMENTATION_UPDATED'
  | 'TEST_ADDED'
  | 'CONFIG_CHANGED';

// Define payload types for each action
export interface ActionPayloads {
  FILE_MODIFIED: {
    filePath: string;
    summary: string;
    changes: string[];
  };
  COMPONENT_ADDED: {
    componentName: string;
    location: string;
    dependencies: string[];
  };
  DEPENDENCY_ADDED: {
    name: string;
    version: string;
    type: 'production' | 'development';
  };
  DOCUMENTATION_UPDATED: {
    file: string;
    type: 'added' | 'modified' | 'deleted';
    summary: string;
  };
  TEST_ADDED: {
    filePath: string;
    testType: 'unit' | 'integration' | 'e2e';
    coverage: number;
  };
  CONFIG_CHANGED: {
    file: string;
    changes: Record<string, any>;
  };
}

export interface MCPServerEvents {
  error: (error: Error) => void;
  contextUpdated: (context: ProjectContext) => void;
  componentAdded: (component: { name: string; location: string }) => void;
  stateUpdated: (state: RepositoryState) => void;
}

export class MCPServer extends EventEmitter {
  private wss: WebSocketServer;
  private context: ProjectContext = {
    components: {},
    state: {},
    actionLog: []
  };
  private state: RepositoryState = {
    components: {},
    state: {},
    lastUpdated: new Date().toISOString()
  };
  private config: MCPConfig = {
    port: 8080,
    validationRules: [],
    logLevel: 'info',
    autoSave: true,
    backupInterval: 300000 // 5 minutes in milliseconds
  };

  constructor(port: number = 8080) {
    super();
    this.config.port = port;
    this.wss = new WebSocketServer({ port });
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[INFO] New client connected');
      
      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data.toString()) as MCPMessage;
          const validationResult = validateMCPMessage(message);
          
          if (!validationResult.isValid && validationResult.errors) {
            console.error('[ERROR] Invalid message:', validationResult.errors.join(', '));
            return;
          }
          
          this.handleMessage(message, ws);
        } catch (error) {
          console.error('[ERROR] Error in handleMessage:', error);
          this.emit('error', error);
        }
      });

      ws.on('close', () => {
        console.log('[INFO] Client disconnected');
      });
    });
  }

  private handleMessage(message: MCPMessage, ws: WebSocket): void {
    switch (message.type) {
      case MCPMessageType.COMPONENT_ADDED:
        this.handleComponentAdded(message.payload);
        break;
      case MCPMessageType.STATE_UPDATED:
        this.handleStateUpdated(message.payload);
        break;
      default:
        console.warn(`[WARN] Unknown message type: ${message.type}`);
    }
  }

  private handleComponentAdded(payload: any): void {
    const { componentName, filePath, dependencies } = payload;
    this.context.components[componentName] = {
      filePath,
      dependencies
    };
    this.state.components[componentName] = {
      filePath,
      dependencies
    };
    this.state.lastUpdated = new Date().toISOString();
    this.emit('componentAdded', { componentName, filePath, dependencies });
    this.broadcastState();
  }

  private handleStateUpdated(payload: any): void {
    this.context.state = { ...this.context.state, ...payload };
    this.state.state = { ...this.state.state, ...payload };
    this.state.lastUpdated = new Date().toISOString();
    this.emit('stateUpdated', payload);
    this.broadcastState();
  }

  private sendState(ws: WebSocket): void {
    ws.send(JSON.stringify({
      type: MCPMessageType.STATE_UPDATED,
      payload: this.state,
      timestamp: new Date().toISOString()
    }));
  }

  private broadcastState(): void {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: MCPMessageType.STATE_UPDATED,
          payload: this.state,
          timestamp: new Date().toISOString()
        }));
      }
    });
  }

  public start(): void {
    console.log(`[INFO] MCP Server started on port ${this.config.port}`);
  }
}

export default MCPServer; 