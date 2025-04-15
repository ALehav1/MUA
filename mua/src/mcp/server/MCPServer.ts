import { WebSocket, WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import { MCPMessage, MCPResponse, MCPConfig, ProjectContext, RepositoryState } from '../types/mcp.types';

export class MCPServer extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private context: ProjectContext = { components: [], state: {} };
  private state: RepositoryState = { components: [], state: {} };
  private portAttempts = 0;
  private maxPortAttempts = 5;
  private plan: any = null; // TODO: Replace 'any' with ProjectPlan type
  private guidelines: any = null; // TODO: Replace 'any' with GuidelineSet type

  constructor(private config: MCPConfig) {
    super();
  }

  public start(): void {
    try {
      this.wss = new WebSocketServer({
        port: this.config.port,
        host: this.config.host
      });
      console.log(`[MCPServer] WebSocketServer started on ws://${this.config.host}:${this.config.port}`);
      this.wss.on('error', (err) => {
        console.error('[MCPServer] WebSocketServer error:', err);
      });
      this.setupWebSocketHandlers();
      this.emit('started', this.config.port);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[MCPServer] New client connected');
      if (this.clients.size >= this.config.maxConnections) {
        ws.close(1008, 'Maximum connections reached');
        return;
      }

      this.clients.add(ws);
      this.emit('clientConnected', this.clients.size);

      ws.on('message', (data: string) => {
        try {
          const message: MCPMessage = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (error) {
          this.handleError(error as Error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        this.emit('clientDisconnected', this.clients.size);
      });

      ws.on('error', (error: Error) => {
        this.handleError(error);
      });
    });

    this.wss.on('error', (error: Error & { code?: string }) => {
      if (error.code === 'EADDRINUSE') {
        this.handlePortConflict();
      } else {
        this.handleError(error);
      }
    });
  }

  private handleMessage(ws: WebSocket, message: MCPMessage): void {
    // Catch-all log for every received message
    console.log('[MCPServer] Received message:', JSON.stringify(message));
    const response: MCPResponse = {
      type: message.type,
      success: true,
      timestamp: new Date().toISOString()
    };

    try {
      switch (message.type) {
        case 'TRACK_COMPONENT':
          this.handleTrackComponent(message);
          break;
        case 'GET_CONTEXT':
          response.data = this.context;
          break;
        case 'UPDATE_CONTEXT':
          this.context = { ...this.context, ...message.payload };
          break;
        case 'GET_STATE':
          response.data = this.state;
          break;
        case 'UPDATE_STATE':
          this.state = { ...this.state, ...message.payload };
          break;
        case 'GET_PLAN':
          console.log('[MCPServer] GET_PLAN received');
          response.data = this.plan;
          break;
        case 'UPDATE_PLAN':
          console.log('[MCPServer] UPDATE_PLAN received. Payload:', JSON.stringify(message.payload));
          if (this.isValidPlan(message.payload)) {
            this.plan = message.payload;
            response.success = true;
            response.data = this.plan;
          } else {
            response.success = false;
            response.error = 'Invalid plan payload';
            console.error('[MCPServer] Invalid plan payload:', JSON.stringify(message.payload));
          }
          break;
        case 'GET_GUIDELINES':
          console.log('[MCPServer] GET_GUIDELINES received');
          response.data = this.guidelines;
          break;
        case 'UPDATE_GUIDELINES':
          console.log('[MCPServer] UPDATE_GUIDELINES received. Payload:', JSON.stringify(message.payload));
          if (this.isValidGuidelines(message.payload)) {
            this.guidelines = message.payload;
            response.success = true;
            response.data = this.guidelines;
          } else {
            response.success = false;
            response.error = 'Invalid guidelines payload';
            console.error('[MCPServer] Invalid guidelines payload:', JSON.stringify(message.payload));
          }
          break;
        default:
          response.success = false;
          response.error = 'Unknown message type: ' + message.type;
          console.error('[MCPServer] Unknown message type:', message.type, 'Payload:', JSON.stringify(message.payload));
      }
    } catch (error) {
      response.success = false;
      response.error = (error as Error).message;
      console.error('[MCPServer] Exception in handleMessage:', error);
    }

    ws.send(JSON.stringify(response));
  }

  private handleTrackComponent(message: MCPMessage): void {
    const component = message.payload;
    const existingIndex = this.context.components.findIndex(c => c.id === component.id);

    if (existingIndex >= 0) {
      this.context.components[existingIndex] = component;
    } else {
      this.context.components.push(component);
    }
  }

  private handlePortConflict(): void {
    if (this.portAttempts >= this.maxPortAttempts) {
      this.emit('error', new Error('Max port attempts reached'));
      return;
    }

    this.portAttempts++;
    const newPort = this.config.port + this.portAttempts;

    if (this.wss) {
      this.wss.close();
    }

    this.config.port = newPort;
    this.start();
  }

  private handleError(error: Error): void {
    this.emit('error', error);
  }

  public stop(): void {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    this.clients.clear();
  }

  public getPort(): number {
    return this.config.port;
  }

  public getConnections(): number {
    return this.clients.size;
  }

  private isValidPlan(plan: any): boolean {
    return plan && Array.isArray(plan.steps) && typeof plan.lastUpdated === 'string';
  }

  private isValidGuidelines(guidelines: any): boolean {
    return guidelines && Array.isArray(guidelines.rules) && typeof guidelines.lastUpdated === 'string';
  }
}