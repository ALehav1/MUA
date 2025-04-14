import { EventEmitter } from 'events';
import { Server, Socket } from 'net';
import { MCPMessage, MCPMessageType } from '../types/mcpTypes';
import { logger } from '../utils/logger';
import { validateMCPMessage } from '../utils/validation';
import { handleMCPMessage } from '../handlers/messageHandler';
import { handleError } from '../handlers/errorHandler';
import { ProjectContext, RepositoryState, ActionLog, MCPConfig } from '../models/types';
import { validateAction, trackChanges, updateDocumentation, validateDependencies, checkComponentConsistency } from '../utils/contextUtils';
import fs from 'fs';

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

interface MCPServerEvents {
  actionProcessed: (action: ActionLog) => void;
  error: (error: Error) => void;
  contextUpdated: (context: ProjectContext) => void;
  stateChanged: (state: RepositoryState) => void;
  validationWarning: (warning: { type: string; files?: string[]; file?: string; missing?: string }) => void;
}

declare interface MCPServer {
  on<U extends keyof MCPServerEvents>(event: U, listener: MCPServerEvents[U]): this;
  emit<U extends keyof MCPServerEvents>(event: U, ...args: Parameters<MCPServerEvents[U]>): boolean;
}

export class MCPServer extends EventEmitter {
  private server: Server;
  private clients: Map<string, Socket>;
  private port: number;
  private isRunning: boolean;
  private context: ProjectContext;
  private repositoryState: RepositoryState;
  private actionLog: ActionLog[];
  private config: MCPConfig;

  constructor(port: number = 8080) {
    super();
    this.server = new Server();
    this.clients = new Map();
    this.port = port;
    this.isRunning = false;
    this.config = this.initializeConfig();
    this.context = this.initializeContext();
    this.repositoryState = this.initializeRepositoryState();
    this.actionLog = [];
  }

  private initializeContext(): ProjectContext {
    return {
      projectName: 'MUA',
      currentPhase: 'Phase 1',
      lastUpdated: new Date().toISOString(),
      activeComponents: [],
      dependencies: {},
      documentation: {
        plan: 'plan.md',
        dependencies: 'Dependencies.md',
        tracking: 'Project_tracking.md'
      }
    };
  }

  private initializeRepositoryState(): RepositoryState {
    return {
      lastCommit: '',
      currentBranch: 'main',
      modifiedFiles: [],
      stagedChanges: [],
      untrackedFiles: []
    };
  }

  private initializeConfig(): MCPConfig {
    return {
      maxActionLogSize: 100
    };
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
      const logEntry = await trackChanges(action, payload, this.context);
      this.actionLog.push(logEntry);

      // Maintain log size
      if (this.actionLog.length > this.config.maxActionLogSize) {
        this.actionLog.shift();
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
    }

    this.context.lastUpdated = new Date().toISOString();
  }

  private async handleFileModified(payload: ActionPayloads['FILE_MODIFIED']): Promise<void> {
    updateDocumentation(payload.filePath, 'modified', payload.summary);
    this.repositoryState.modifiedFiles.push(payload.filePath);
  }

  private async handleComponentAdded(payload: ActionPayloads['COMPONENT_ADDED']): Promise<void> {
    this.context.activeComponents.push(payload.componentName);
    await checkComponentConsistency(this.context.activeComponents, this.context);
  }

  private async handleDependencyAdded(payload: ActionPayloads['DEPENDENCY_ADDED']): Promise<void> {
    this.context.dependencies[payload.name] = payload.version;
    await validateDependencies(this.context.dependencies);
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

  public getState(): { context: ProjectContext; repositoryState: RepositoryState } {
    return {
      context: { ...this.context },
      repositoryState: { ...this.repositoryState }
    };
  }

  public getActionLog(): ActionLog[] {
    return [...this.actionLog];
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
      handleError(error, 'Failed to validate existing state');
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
      handleError(error, 'Failed to validate documentation content');
    }
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Server is already running');
    }

    try {
      // First validate existing state
      await this.validateExistingState();

      this.server.listen(this.port, () => {
        logger.info(`MCP Server listening on port ${this.port}`);
        this.isRunning = true;
      });

      // ... rest of existing start method ...
    } catch (error) {
      handleError(error, 'Failed to start MCP server');
      throw error;
    }
  }
}

export default MCPServer; 