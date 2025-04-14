import { MCPMessageType, MCPMessage } from '../types/mcpTypes';

class MCPClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.ws = new WebSocket('ws://localhost:8080');
      this.setupWebSocket();
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      this.attemptReconnect();
    }
  }

  private setupWebSocket(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('Connected to MCP server');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as MCPMessage;
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('Disconnected from MCP server');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  private handleMessage(message: MCPMessage): void {
    switch (message.type) {
      case MCPMessageType.STATE_UPDATED:
        console.log('State updated:', message.payload);
        break;
      case MCPMessageType.COMPONENT_ADDED:
        console.log('Component added:', message.payload);
        break;
      case MCPMessageType.DIRECTORY_CHANGED:
        console.log('Directory changed:', message.payload);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  public sendMessage(message: MCPMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

export const mcpClient = new MCPClient(); 