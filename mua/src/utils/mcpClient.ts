import { MCPMessageType, MCPMessage } from '../../mcp/types/mcpTypes';

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

    this.ws.onclose = () => {
      console.log('Disconnected from MCP server');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as MCPMessage;
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectTimeout * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(message: MCPMessage): void {
    switch (message.type) {
      case MCPMessageType.FILE_MODIFIED:
        console.log('File modified:', message.payload);
        break;
      case MCPMessageType.COMPONENT_ADDED:
        console.log('Component added:', message.payload);
        break;
      case MCPMessageType.DIRECTORY_CHANGED:
        console.log('Directory changed:', message.payload);
        break;
      case MCPMessageType.PROJECT_STRUCTURE:
        console.log('Project structure updated:', message.payload);
        break;
      case MCPMessageType.ERROR:
        console.error('MCP error:', message.payload);
        break;
    }
  }

  public sendMessage(message: MCPMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

export const mcpClient = new MCPClient(); 