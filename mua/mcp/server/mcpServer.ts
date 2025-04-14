import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { MCPMessage, MCPMessageType, ProjectContext, RepositoryState, MCPConfig, DirectoryChangePayload } from '../types/mcpTypes';
import { logger } from '../utils/logger';
import { validateMCPMessage } from '../utils/validation';
import { handleMCPMessage } from '../handlers/messageHandler';
import { handleError } from '../handlers/errorHandler';
import { ValidationRule } from '../models/types';
import { validateAction, trackChanges, updateDocumentation, validateDependencies, checkComponentConsistency } from '../utils/contextUtils';
import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import { watch } from 'chokidar';

// Define all possible action types
export type ActionType = 
  | 'FILE_MODIFIED'
  | 'COMPONENT_ADDED'
  | 'DEPENDENCY_ADDED'
  | 'DOCUMENTATION_UPDATED'
  | 'TEST_ADDED'
  | 'CONFIG_CHANGED'
  | 'DIRECTORY_CHANGED';

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
  DIRECTORY_CHANGED: {
    oldPath: string;
    newPath: string;
    type: 'moved' | 'renamed' | 'created' | 'deleted';
  };
}

export interface MCPServerEvents {
  error: (error: Error) => void;
  contextUpdated: (context: ProjectContext) => void;
  componentAdded: (component: { name: string; location: string }) => void;
  stateUpdated: (state: RepositoryState) => void;
  directoryChanged: (payload: ActionPayloads['DIRECTORY_CHANGED']) => void;
}

export class MCPServer extends EventEmitter {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private watcher: chokidar.FSWatcher | null = null;
  private config: MCPConfig;
  private context: ProjectContext = {
    components: {},
    state: {},
    actionLog: [],
    projectRoot: process.cwd()
  };
  private state: RepositoryState = {
    components: {},
    state: {},
    lastUpdated: new Date().toISOString(),
    projectRoot: process.cwd()
  };

  constructor(port: number = 8080) {
    super();
    this.config = {
      port,
      projectRoot: process.cwd(),
      validationRules: [],
      logLevel: 'info',
      autoSave: true,
      backupInterval: 300000
    };
    this.wss = new WebSocketServer({ port });
    this.setupWebSocket();
    this.setupFileWatcher();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      logger.info('New client connected');
      this.clients.add(ws);

      ws.on('message', (data: string) => {
        try {
          const message: MCPMessage = JSON.parse(data);
          if (!validateMCPMessage(message)) {
            logger.error('Invalid message received:', message);
            return;
          }
          this.handleMessage(message);
        } catch (error) {
          logger.error('Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        logger.info('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  private setupFileWatcher(): void {
    this.watcher = chokidar.watch(this.config.projectRoot, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    this.watcher
      .on('add', (filePath) => this.handleFileChange('created', filePath))
      .on('change', (filePath) => this.handleFileChange('modified', filePath))
      .on('unlink', (filePath) => this.handleFileChange('deleted', filePath))
      .on('addDir', (dirPath) => this.handleDirectoryChange('created', dirPath))
      .on('unlinkDir', (dirPath) => this.handleDirectoryChange('deleted', dirPath))
      .on('error', (error) => logger.error('Watcher error:', error));
  }

  private handleFileChange(type: 'created' | 'modified' | 'deleted', filePath: string): void {
    const relativePath = path.relative(this.config.projectRoot, filePath);
    const message: MCPMessage = {
      type: MCPMessageType.DIRECTORY_CHANGED,
      payload: {
        oldPath: type === 'deleted' ? relativePath : undefined,
        newPath: type === 'deleted' ? undefined : relativePath,
        type: type
      } as DirectoryChangePayload,
      timestamp: new Date().toISOString()
    };
    this.broadcast(message);
  }

  private handleDirectoryChange(typeOrPayload: 'created' | 'deleted' | DirectoryChangePayload, dirPath?: string): void {
    let payload: DirectoryChangePayload;
    
    if (typeof typeOrPayload === 'string') {
      const relativePath = path.relative(this.config.projectRoot, dirPath!);
      payload = {
        oldPath: typeOrPayload === 'deleted' ? relativePath : undefined,
        newPath: typeOrPayload === 'deleted' ? undefined : relativePath,
        type: typeOrPayload
      };
    } else {
      payload = typeOrPayload;
    }

    logger.info(`Directory change detected: ${payload.type} at ${payload.newPath || payload.oldPath}`);
    this.broadcast({
      type: MCPMessageType.DIRECTORY_CHANGED,
      payload,
      timestamp: new Date().toISOString()
    });
  }

  private handleMessage(message: MCPMessage): void {
    switch (message.type) {
      case MCPMessageType.STATE_UPDATED:
        this.handleStateUpdated(message.payload);
        break;
      case MCPMessageType.COMPONENT_ADDED:
        this.handleComponentAdded(message.payload);
        break;
      case MCPMessageType.DIRECTORY_CHANGED:
        this.handleDirectoryChange(message.payload);
        break;
      case MCPMessageType.ERROR:
        this.emit('error', new Error(message.payload as string));
        break;
      case MCPMessageType.WARNING:
        logger.warn(message.payload as string);
        break;
      case MCPMessageType.INFO:
        logger.info(message.payload as string);
        break;
      default:
        logger.warn('Unknown message type:', message.type);
    }
  }

  private handleComponentAdded(payload: any): void {
    const { componentName, filePath, dependencies } = payload;
    
    // Validate the file path is within the project root
    const absolutePath = path.resolve(this.config.projectRoot, filePath);
    if (!absolutePath.startsWith(this.config.projectRoot)) {
      logger.error(`Invalid file path: ${filePath} is outside project root`);
      return;
    }

    this.context.components[componentName] = {
      filePath,
      dependencies
    };

    this.state.components[componentName] = {
      filePath,
      dependencies
    };

    this.state.lastUpdated = new Date().toISOString();
    this.broadcastState();
    this.emit('componentAdded', { name: componentName, location: filePath });
  }

  private handleStateUpdated(payload: any): void {
    this.state = { ...this.state, ...payload };
    this.state.lastUpdated = new Date().toISOString();
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
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        this.sendState(client);
      }
    });
  }

  private broadcast(message: MCPMessage): void {
    const messageString = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }

  public start(): void {
    logger.info(`MCP Server started on port ${this.config.port}`);
  }

  public close(): void {
    this.watcher?.close();
    this.wss.close();
    this.clients.clear();
  }
}

export default MCPServer; 