import { MCPMessageType, MCPMessage } from "../types/mcpTypes";

class MCPClient {
  private ws: WebSocket | null = null;
  private messageQueue: MCPMessage[] = [];
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;
  private readonly reconnectDelay: number = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  public getWebSocket(): WebSocket | null {
    return this.ws;
  }

  private connect(): void {
    try {
      this.ws = new WebSocket('ws://localhost:8080');
      this.setupWebSocket();
    } catch (error) {
      console.error('[ERROR] Failed to create WebSocket:', error);
      this.handleReconnect();
    }
  }

  private setupWebSocket(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('[INFO] Connected to MCP server');
      this.reconnectAttempts = 0;
      this.processMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[INFO] Received message:', data);
      } catch (error) {
        console.error('[ERROR] Failed to parse message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('[INFO] Disconnected from MCP server');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('[ERROR] WebSocket error:', error);
    };
  }

  private handleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[INFO] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('[ERROR] Max reconnection attempts reached');
    }
  }

  private processMessageQueue(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  public sendMessage(message: MCPMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.messageQueue.push(message);
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('[ERROR] Failed to send message:', error);
      this.messageQueue.push(message);
    }
  }

  public trackComponentAdded(componentName: string, filePath: string, dependencies: string[]): void {
    const message: MCPMessage = {
      type: MCPMessageType.COMPONENT_ADDED,
      payload: {
        componentName,
        filePath,
        dependencies
      },
      timestamp: new Date().toISOString()
    };
    this.sendMessage(message);
  }
}

export const mcpClient = new MCPClient();
