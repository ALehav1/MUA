import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { MCPMessage, MCPResponse } from '../types/mcp.types';

export class MCPClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: MCPMessage[] = [];
  private isConnected = false;

  constructor(
    private url: string,
    private options: {
      maxReconnectAttempts?: number;
      reconnectDelay?: number;
    } = {}
  ) {
    super();
    this.maxReconnectAttempts = options.maxReconnectAttempts || this.maxReconnectAttempts;
    this.reconnectDelay = options.reconnectDelay || this.reconnectDelay;
  }

  public connect(): void {
    try {
      this.ws = new WebSocket(this.url);
      this.setupWebSocketHandlers();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.on('open', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.processMessageQueue();
    });

    this.ws.on('message', (data: string) => {
      try {
        const response: MCPResponse = JSON.parse(data);
        this.emit('message', response);
      } catch (error) {
        this.handleError(error as Error);
      }
    });

    this.ws.on('close', () => {
      this.isConnected = false;
      this.emit('disconnected');
      this.handleReconnect();
    });

    this.ws.on('error', (error: Error) => {
      this.handleError(error);
    });
  }

  public send(message: MCPMessage): void {
    if (!this.isConnected) {
      this.messageQueue.push(message);
      return;
    }

    try {
      this.ws?.send(JSON.stringify(message));
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private handleError(error: Error): void {
    this.emit('error', error);
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
} 