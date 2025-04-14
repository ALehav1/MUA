import { Server as WebSocketServer, WebSocket } from 'ws';
import { MCPMessage, MCPMessageType, MCPServerState, ComponentNode, UserInteraction, DataFlow, PerformanceMetric, MCPConfig } from '../types/mcpTypes';
import { logger } from '../utils/logger';
import { validateMCPMessage } from '../utils/validation';
import { handleMCPMessage } from '../handlers/messageHandler';
import { handleError } from '../handlers/errorHandler';
import { ProjectContext, RepositoryState, ActionLog, ComponentContext, DependencyContext, ValidationResult, ProjectConfig } from '../models/types';
import { validateAction, trackChanges, updateDocumentation, validateDependencies, checkComponentConsistency } from '../utils/contextUtils';
import { validateProjectStructure } from '../utils/projectStructure';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { EventEmitter } from 'events';

// Define all possible action types
export type ActionType = 
  | 'FILE_MODIFIED'
  | 'COMPONENT_ADDED'
  | 'DEPENDENCY_ADDED'
  | 'DOCUMENTATION_UPDATED'
  | 'TEST_ADDED'
  | 'CONFIG_CHANGED'
  | 'COMPONENT_REMOVED'
  | 'STATE_CHANGED'
  | 'USER_INTERACTION'
  | 'DATA_FLOW'
  | 'PERFORMANCE_METRIC';

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
  COMPONENT_REMOVED: {
    componentName: string;
  };
  STATE_CHANGED: {
    componentName: string;
    state: Record<string, any>;
  };
  USER_INTERACTION: {
    interaction: string;
    details: Record<string, any>;
  };
  DATA_FLOW: {
    source: string;
    target: string;
    data: Record<string, any>;
  };
  PERFORMANCE_METRIC: {
    metric: string;
    value: number;
  };
}

export interface MCPServerEvents {
  actionProcessed: (action: ActionLog) => void;
  error: (error: Error) => void;
  contextUpdated: (context: ProjectContext) => void;
  stateChanged: (state: RepositoryState) => void;
  validationWarning: (warning: { type: string; files?: string[]; file?: string; missing?: string }) => void;
  structureError: (error: Error | string[]) => void;
}

export class MCPServer extends EventEmitter {
  private server: WebSocketServer;
  private clients: Map<string, WebSocket>;
  private port: number;
  private isRunning: boolean;
  private context: ProjectContext;
  private repositoryState: RepositoryState;
  private actionLogs: ActionLog[] = [];
  private config: MCPConfig;
  private state: MCPServerState;
  private componentTree: Map<string, ComponentNode>;
  private dataFlows: DataFlow[];
  private performanceMetrics: PerformanceMetric[];
  private isInitialized: boolean = false;
  private lastUpdated: Date;
  private projectRoot: string;

  constructor(port: number = 8080, projectRoot: string) {
    super();
    this.server = new WebSocketServer({ port });
    this.clients = new Map();
    this.port = port;
    this.isRunning = false;
    this.projectRoot = projectRoot;
    this.context = {
      components: new Map(),
      dependencies: new Map(),
      documentation: new Map(),
      tests: new Map(),
      config: {
        projectRoot: '',
        validationRules: [],
        directoryRequirements: []
      },
      lastUpdated: Date.now()
    };
    this.repositoryState = this.initializeRepositoryState();
    this.state = {
      components: new Map(),
      interactions: [],
      dataFlows: [],
      performanceMetrics: []
    };
    this.componentTree = new Map();
    this.dataFlows = [];
    this.performanceMetrics = [];
    this.lastUpdated = new Date();
    this.config = this.initializeConfig();
    
    // Validate project structure on initialization
    this.validateStructure();
  }

  private initializeContext(): ProjectContext {
    return {
      components: new Map(),
      dependencies: new Map(),
      documentation: new Map(),
      tests: new Map(),
      config: {
        projectRoot: this.projectRoot,
        validationRules: [],
        directoryRequirements: []
      },
      lastUpdated: Date.now()
    };
  }

  private initializeRepositoryState(): RepositoryState {
    return {
      lastCommit: '',
      branch: 'main',
      changes: []
    };
  }

  private initializeConfig(): MCPConfig {
    return {
      projectRoot: this.projectRoot,
      documentationPath: path.join(this.projectRoot, 'docs'),
      validationRules: {
        requiredDirectories: ['src', 'mcp'],
        requiredFiles: ['package.json', 'tsconfig.json'],
        directoryRules: {
          'src': {
            requiredFiles: ['App.tsx', 'main.tsx'],
            allowedExtensions: ['.ts', '.tsx']
          },
          'mcp': {
            requiredFiles: ['server/index.ts', 'client/mcpClient.ts'],
            allowedExtensions: ['.ts']
          }
        }
      },
      maxActionLogSize: 1000
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const config: ProjectConfig = {
        projectRoot: this.projectRoot,
        validationRules: [],
        directoryRequirements: []
      };
      this.context = {
        components: new Map(),
        dependencies: new Map(),
        documentation: new Map(),
        tests: new Map(),
        config,
        lastUpdated: Date.now()
      };
      await this.validateStructure();
      this.isInitialized = true;
      logger.info('MCP Server initialized');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to initialize MCP server:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  public async processAction<T extends ActionType>(
    action: T,
    payload: ActionPayloads[T]
  ): Promise<void> {
    try {
      // Validate the action
      const isValid = await validateAction(action, payload, this.context);
      if (!isValid) {
        throw new Error(`Invalid action: ${action}`);
      }

      // Track the change
      const logEntry: ActionLog = {
        id: crypto.randomUUID(),
        type: action,
        timestamp: Date.now(),
        payload
      };
      this.actionLogs.push(logEntry);

      // Maintain log size
      if (this.actionLogs.length > this.config.maxActionLogSize) {
        this.actionLogs.shift();
      }

      // Update context based on action type
      await this.updateContext(action, payload);

      // Emit events
      this.emit('actionProcessed', logEntry);
      this.emit('contextUpdated', this.context);
      this.emit('stateChanged', this.repositoryState);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit('error', err);
      throw err;
    }
  }

  private async updateContext<T extends ActionType>(
    action: T,
    payload: ActionPayloads[T]
  ): Promise<void> {
    switch (action) {
      case 'FILE_MODIFIED':
        await this.handleFileModified(payload as ActionPayloads['FILE_MODIFIED']);
        break;
      case 'COMPONENT_ADDED':
        await this.handleComponentAdded(payload as ActionPayloads['COMPONENT_ADDED']);
        break;
      case 'DEPENDENCY_ADDED':
        await this.handleDependencyAdded(payload as ActionPayloads['DEPENDENCY_ADDED']);
        break;
      case 'DOCUMENTATION_UPDATED':
        await this.handleDocumentationUpdated(payload as ActionPayloads['DOCUMENTATION_UPDATED']);
        break;
      case 'TEST_ADDED':
        await this.handleTestAdded(payload as ActionPayloads['TEST_ADDED']);
        break;
      case 'CONFIG_CHANGED':
        await this.handleConfigChanged(payload as ActionPayloads['CONFIG_CHANGED']);
        break;
      case 'COMPONENT_REMOVED':
        await this.handleComponentRemoved(payload as ActionPayloads['COMPONENT_REMOVED']);
        break;
      case 'STATE_CHANGED':
        await this.handleStateChanged(payload as ActionPayloads['STATE_CHANGED']);
        break;
      case 'USER_INTERACTION':
        await this.handleUserInteraction(payload as ActionPayloads['USER_INTERACTION']);
        break;
      case 'DATA_FLOW':
        await this.handleDataFlow(payload as ActionPayloads['DATA_FLOW']);
        break;
      case 'PERFORMANCE_METRIC':
        await this.handlePerformanceMetric(payload as ActionPayloads['PERFORMANCE_METRIC']);
        break;
    }

    this.context.lastUpdated = Date.now();
  }

  private async handleFileModified(payload: ActionPayloads['FILE_MODIFIED']): Promise<void> {
    updateDocumentation(payload.filePath, 'modified', payload.summary);
    this.repositoryState.changes.push(payload.filePath);
  }

  private async handleComponentAdded(payload: ActionPayloads['COMPONENT_ADDED']): Promise<void> {
    const componentContext = {
      name: payload.componentName,
      filePath: payload.location,
      dependencies: payload.dependencies,
      props: {},
      state: {}
    };
    this.context.components.set(payload.componentName, componentContext);
    await checkComponentConsistency(Array.from(this.context.components.keys()), this.context);
  }

  private async handleDependencyAdded(payload: ActionPayloads['DEPENDENCY_ADDED']): Promise<void> {
    const dependencyContext = {
      name: payload.name,
      version: payload.version,
      type: payload.type
    };
    this.context.dependencies.set(payload.name, dependencyContext);
    await validateDependencies(Array.from(this.context.dependencies.values()));
  }

  private async handleDocumentationUpdated(
    payload: ActionPayloads['DOCUMENTATION_UPDATED']
  ): Promise<void> {
    updateDocumentation(payload.file, payload.type, payload.summary);
  }

  private async handleTestAdded(payload: ActionPayloads['TEST_ADDED']): Promise<void> {
    // Update test coverage tracking
    // This is a placeholder for test coverage tracking logic
  }

  private async handleConfigChanged(payload: ActionPayloads['CONFIG_CHANGED']): Promise<void> {
    // Handle configuration changes
    // This is a placeholder for config change handling logic
  }

  private async handleComponentRemoved(payload: ActionPayloads['COMPONENT_REMOVED']): Promise<void> {
    this.context.components.delete(payload.componentName);
    await this.validateStructure();
  }

  private async handleStateChanged(payload: ActionPayloads['STATE_CHANGED']): Promise<void> {
    const component = this.context.components.get(payload.componentName);
    if (component) {
      component.state = payload.state;
    }
  }

  private async handleUserInteraction(payload: ActionPayloads['USER_INTERACTION']): Promise<void> {
    logger.info(`User interaction: ${payload.interaction}`, payload.details);
  }

  private async handleDataFlow(payload: ActionPayloads['DATA_FLOW']): Promise<void> {
    logger.info(`Data flow: ${payload.source} -> ${payload.target}`, payload.data);
  }

  private async handlePerformanceMetric(payload: ActionPayloads['PERFORMANCE_METRIC']): Promise<void> {
    logger.info(`Performance metric: ${payload.metric} = ${payload.value}`);
  }

  public getState(): { context: ProjectContext; repositoryState: RepositoryState } {
    return {
      context: { ...this.context },
      repositoryState: { ...this.repositoryState }
    };
  }

  public getActionLog(): ActionLog[] {
    return [...this.actionLogs];
  }

  public async validateRepositoryState(): Promise<boolean> {
    // Implement repository state validation logic
    return true;
  }

  public async trackDocumentationChanges(): Promise<void> {
    // Implement documentation tracking logic
  }

  private async validateExistingState(): Promise<void> {
    try {
      // Check documentation files
      const requiredDocs = [
        'README.md',
        'plan.md',
        'Dependencies.md',
        'Project_tracking.md'
      ];

      const missingDocs = requiredDocs.filter(doc => !fs.existsSync(doc));
      if (missingDocs.length > 0) {
        logger.warn(`Missing documentation files: ${missingDocs.join(', ')}`);
        this.emit('validationWarning', {
          type: 'missing_documentation',
          files: missingDocs
        });
      }

      // Validate existing documentation content
      await this.validateDocumentationContent();

      // Scan for existing components
      await this.scanProjectDirectory();

      // Validate against rules
      this.validateProjectState();

      logger.info('Initial state validation complete');
    } catch (error) {
      throw handleError(error, 'Failed to validate existing state');
    }
  }

  private async validateDocumentationContent(): Promise<void> {
    try {
      // Check README.md
      if (fs.existsSync('README.md')) {
        const readmeContent = await fs.promises.readFile('README.md', 'utf-8');
        // Add validation rules for README content
        if (!readmeContent.includes('## Project Overview')) {
          this.emit('validationWarning', {
            type: 'incomplete_documentation',
            file: 'README.md',
            missing: 'Project Overview section'
          });
        }
      }

      // Similar checks for other documentation files
      // ... add more validation rules ...
    } catch (error) {
      throw handleError(error, 'Failed to validate documentation content');
    }
  }

  private async handleError(error: unknown): Promise<void> {
    const err = error instanceof Error ? error : new Error(String(error));
    this.emit('error', err);
    throw err;
  }

  private async validateStructure(): Promise<void> {
    try {
      const validationResult = await validateProjectStructure(this.projectRoot);
      if (!validationResult.isValid) {
        const errorMessage = validationResult.errors?.length 
          ? `Project structure validation failed: ${validationResult.errors.join(', ')}`
          : 'Project structure validation failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw handleError(error, 'Failed to validate project structure');
    }
  }

  private async scanProjectDirectory(): Promise<void> {
    const scanDir = async (dir: string): Promise<void> => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          await scanDir(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const componentId = path.relative(this.projectRoot, fullPath);
          if (!this.state.components.has(componentId)) {
            this.state.components.set(componentId, {
              id: componentId,
              name: path.basename(file, path.extname(file)),
              filePath: fullPath,
              children: [],
              props: {},
              state: {}
            });
          }
        }
      }
    };

    await scanDir(this.projectRoot);
  }

  private validateProjectState(): void {
    // Validate component consistency
    const components = Array.from(this.state.components.entries());
    for (const [id, component] of components) {
      // Check if component file exists
      if (!fs.existsSync(component.filePath)) {
        this.emit('validationWarning', {
          type: 'missing_component_file',
          file: component.filePath
        });
      }

      // Check component dependencies
      const content = fs.readFileSync(component.filePath, 'utf-8');
      const imports = content.match(/import.*from\s+['"](.*)['"]/g) || [];
      for (const imp of imports) {
        const importPath = imp.match(/['"](.*)['"]/)?.[1];
        if (importPath && !importPath.startsWith('.')) {
          // External dependency
          if (!this.context.dependencies.has(importPath)) {
            this.emit('validationWarning', {
              type: 'missing_dependency',
              file: component.filePath,
              missing: importPath
            });
          }
        }
      }
    }
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    try {
      this.server.on('connection', (ws: WebSocket) => {
        const clientId = crypto.randomUUID();
        this.clients.set(clientId, ws);

        ws.on('message', (data: string) => {
          try {
            const message = JSON.parse(data) as MCPMessage;
            this.handleMessage(message, clientId);
          } catch (error) {
            logger.error('Error handling message:', error);
          }
        });

        ws.on('close', () => {
          this.clients.delete(clientId);
        });

        ws.on('error', (error) => {
          logger.error('WebSocket error:', error);
          this.clients.delete(clientId);
        });
      });

      this.isRunning = true;
      logger.info('MCP Server started on port', this.port);
    } catch (error) {
      logger.error('Failed to start MCP server:', error);
      throw error;
    }
  }

  private async handleMessage(message: MCPMessage, clientId: string): Promise<void> {
    try {
      const response = await handleMCPMessage(message, clientId);
      const client = this.clients.get(clientId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    } catch (error) {
      handleError(error);
    }
  }

  private async broadcastToClients(message: MCPMessage): Promise<void> {
    for (const client of this.clients.values()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  }

  private logAction(type: string, payload: unknown): ActionLog {
    const action: ActionLog = {
      id: crypto.randomUUID(),
      type,
      timestamp: Date.now(),
      payload
    };
    this.actionLogs.push(action);
    return action;
  }

  private async validateComponents(): Promise<void> {
    try {
      const components = Array.from(this.state.components.entries());
      for (const [id, component] of components) {
        // ... existing validation code ...
      }
    } catch (error) {
      await this.handleError(error);
    }
  }

  private async validateState(): Promise<void> {
    try {
      const components = Array.from(this.state.components.entries());
      for (const [id, component] of components) {
        // ... existing validation code ...
      }
    } catch (error) {
      await this.handleError(error);
    }
  }
}

export default MCPServer; 