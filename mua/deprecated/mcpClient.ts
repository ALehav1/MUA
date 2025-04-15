// DEPRECATED: This file is not used. The canonical MCPClient is in src/mcp/client/MCPClient.ts.
// Retained temporarily for reference. Will be removed in a future cleanup.

import { MCPMessageType, MCPMessage, MCPResponse } from '../../mcp/types/mcpTypes';

interface MCPClientMessage {
  type: MCPMessageType;
  payload: any;
  timestamp: string;
}

class MCPClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: ((message: MCPMessage) => void)[] = [];

  constructor(private url: string) {
    this.connect().then(() => {
      console.log('Connected to MCP server');
    }).catch(console.error);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('Connected to MCP server');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onclose = () => {
          console.log('Disconnected from MCP server');
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as MCPMessage;
            console.log('[MCP] Received message:', message);
            this.messageHandlers.forEach(handler => handler(message));
          } catch (error) {
            console.error('[MCP] Error parsing message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public sendMessage(type: MCPMessageType, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const message: MCPClientMessage = {
          type,
          payload,
          timestamp: new Date().toISOString()
        };
        const messageStr = JSON.stringify(message);
        this.ws.send(messageStr);
        console.log('[MCP] Sent message:', message);
      } catch (error) {
        console.error('[MCP] Error sending message:', error);
      }
    } else {
      console.warn('[MCP] WebSocket not connected');
    }
  }

  public onMessage(handler: (message: MCPMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public send(message: MCPMessage): Promise<MCPResponse> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket is not connected'));
        return;
      }

      this.ws.send(JSON.stringify(message));

      this.ws.onmessage = (event) => {
        try {
          const response: MCPResponse = JSON.parse(event.data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
    });
  }
}

export const mcpClient = new MCPClient('ws://localhost:3000'); 