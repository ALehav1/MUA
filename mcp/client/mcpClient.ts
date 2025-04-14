import { MCPMessage, MCPMessageType, ComponentAddedPayload, PerformancePayload, StateChangePayload } from '../types/mcpTypes';
import { logger } from '../utils/logger';

// Add WebSocket type definitions
interface CloseEvent extends Event {
  readonly code: number;
  readonly reason: string;
  readonly wasClean: boolean;
}

interface WebSocket {
  onopen: ((this: WebSocket, ev: Event) => any) | null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
  onerror: ((this: WebSocket, ev: Event) => any) | null;
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  close(code?: number, reason?: string): void;
}

declare global {
  interface Window {
    WebSocket: {
      new(url: string | URL, protocols?: string | string[]): WebSocket;
      prototype: WebSocket;
      readonly CLOSED: number;
      readonly CLOSING: number;
      readonly CONNECTING: number;
      readonly OPEN: number;
    };
  }
}

// Add type declaration for the global window object
declare const window: Window & typeof globalThis;

class MCPClient {
  private ws: WebSocket | null = null;
  private messageQueue: MCPMessage[] = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 1000;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      try {
        this.ws = new window.WebSocket('ws://localhost:3001');

        if (this.ws) {
          this.ws.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            logger.info('Connected to MCP server');
            this.processMessageQueue();
          };

          this.ws.onmessage = (event: MessageEvent) => {
            try {
              const message: MCPMessage = JSON.parse(event.data);
              this.handleMessage(message);
            } catch (error) {
              logger.error('Error parsing message:', error);
            }
          };

          this.ws.onclose = () => {
            logger.info('Disconnected from MCP server');
            this.isConnected = false;
            this.handleReconnect();
          };

          this.ws.onerror = (error: Event) => {
            logger.error('WebSocket error:', error);
          };
        }
      } catch (error) {
        logger.error('Error initializing WebSocket:', error);
      }
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.init(), this.reconnectDelay);
    } else {
      logger.error('Max reconnection attempts reached');
    }
  }

  private sendMessage(message: MCPMessage) {
    if (this.isConnected && this.ws) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        logger.error('Error sending message:', error);
        this.messageQueue.push(message);
      }
    } else {
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  private handleMessage(message: MCPMessage) {
    switch (message.type) {
      case MCPMessageType.ERROR:
        logger.error('MCP Error:', message.payload);
        break;
      case MCPMessageType.STATE_UPDATE:
        logger.info('MCP State Update:', message.payload);
        break;
      default:
        logger.info('MCP Message:', message);
    }
  }

  public trackComponentAdded(componentName: string, filePath: string, dependencies: string[] = []) {
    const payload: ComponentAddedPayload = {
      componentName,
      filePath,
      dependencies,
      timestamp: new Date().toISOString()
    };

    this.sendMessage({
      type: MCPMessageType.COMPONENT_ADDED,
      payload,
      timestamp: new Date().toISOString(),
      source: 'client'
    });
  }

  public trackPerformance(componentName: string, renderTime: number, mountTime: number, updateTime: number) {
    const payload: PerformancePayload = {
      componentName,
      renderTime,
      mountTime,
      updateTime,
      timestamp: new Date().toISOString()
    };

    this.sendMessage({
      type: MCPMessageType.PERFORMANCE,
      payload,
      timestamp: new Date().toISOString(),
      source: 'client'
    });
  }

  public trackStateChange(componentName: string, stateKey: string, oldValue: any, newValue: any) {
    const payload: StateChangePayload = {
      componentName,
      stateKey,
      oldValue,
      newValue,
      timestamp: new Date().toISOString()
    };

    this.sendMessage({
      type: MCPMessageType.STATE_CHANGE,
      payload,
      timestamp: new Date().toISOString(),
      source: 'client'
    });
  }

  public getState(): void {
    this.sendMessage({
      type: MCPMessageType.GET_STATE,
      payload: {},
      timestamp: new Date().toISOString(),
      source: 'client'
    });
  }
}

export const mcpClient = new MCPClient();
export default mcpClient; 