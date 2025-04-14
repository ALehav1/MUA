import { logger } from '../utils/logger';
import { MCPMessage, MCPMessageType } from '../types/mcpTypes';
import { MCPServer } from './mcpServer';

export interface DevelopmentConfig {
  isDevelopment: boolean;
  verboseLogging: boolean;
  performanceTracking: boolean;
  componentTracking: boolean;
  stateTracking: boolean;
}

export const defaultDevelopmentConfig: DevelopmentConfig = {
  isDevelopment: true,
  verboseLogging: true,
  performanceTracking: true,
  componentTracking: true,
  stateTracking: true
};

class EventEmitter {
  private listeners: Map<string, Function[]>;

  constructor() {
    this.listeners = new Map();
  }

  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  emit(event: string, ...args: any[]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }
}

export class DevelopmentMonitor extends EventEmitter {
  private server: MCPServer;
  private isMonitoring: boolean = false;
  private config: DevelopmentConfig;

  constructor(server: MCPServer, config: DevelopmentConfig = defaultDevelopmentConfig) {
    super();
    this.server = server;
    this.config = config;
  }

  public start(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    logger.info('Development monitor started');

    // Monitor performance
    this.on('performance', (metrics: any) => {
      logger.info('Performance metrics:', metrics);
    });

    // Monitor components
    this.on('component', (component: any) => {
      logger.info('Component update:', component);
    });

    // Monitor state changes
    this.on('state', (state: any) => {
      logger.info('State change:', state);
    });
  }

  public stop(): void {
    this.isMonitoring = false;
    logger.info('Development monitor stopped');
  }

  public log(message: string, data?: any) {
    if (this.config.verboseLogging) {
      console.log(`[MCP Dev] ${message}`, data ? data : '');
    }
  }

  public trackPerformance(componentName: string, metrics: {
    renderTime: number;
    mountTime: number;
    updateTime: number;
  }) {
    if (this.config.performanceTracking) {
      this.emit('performance', { componentName, ...metrics });
    }
  }

  public trackComponent(componentName: string, action: 'mount' | 'update' | 'unmount') {
    if (this.config.componentTracking) {
      this.emit('component', { componentName, action });
    }
  }

  public trackState(componentName: string, stateKey: string, oldValue: any, newValue: any) {
    if (this.config.stateTracking) {
      this.emit('state', { componentName, stateKey, oldValue, newValue });
    }
  }
}

export default DevelopmentMonitor; 