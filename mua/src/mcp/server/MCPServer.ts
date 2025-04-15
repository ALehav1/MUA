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
  private actualPort: number | undefined; // Tracks the real port assigned after server start

  constructor(private config: MCPConfig) {
    super();
  }

  /**
   * Starts the WebSocket server. If port is 0, retrieves the OS-assigned port after startup.
   * Annotated for audit and debugging.
   */
  public start(): void {
    try {
      this.wss = new WebSocketServer({
        port: this.config.port,
        host: this.config.host
      });
      // Retrieve and store the actual port assigned by the OS
      this.wss.on('listening', () => {
        const address = this.wss?.address();
        if (address && typeof address === 'object' && 'port' in address) {
          this.actualPort = address.port;
          console.log(`[MCPServer] WebSocketServer is listening on ws://${this.config.host}:${this.actualPort}`);
        } else {
          this.actualPort = this.config.port;
          console.error('[MCPServer] Could not determine actual port, using config.port:', this.config.port);
        }
        // Emit 'started' only after listening
        this.emit('started', this.getPort());
      });
      console.log(`[MCPServer] WebSocketServer started on ws://${this.config.host}:${this.config.port}`);
      this.wss.on('error', (err) => {
        console.error('[MCPServer] WebSocketServer error:', err);
      });
      this.setupWebSocketHandlers();
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
          this.handleMessage(ws, data);
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

  /**
   * Handles incoming messages from WebSocket clients.
   * Sends error and closes connection on invalid message.
   */
  private handleMessage(ws: WebSocket, message: string): void {
    try {
      console.log('[MCPServer] Received message:', message);
      const parsed: MCPMessage = JSON.parse(message);
      const response: MCPResponse = {
        type: parsed.type,
        success: true,
        timestamp: new Date().toISOString()
      };

      try {
        switch (parsed.type) {
          case 'TRACK_COMPONENT':
            this.handleTrackComponent(parsed);
            break;
          case 'GET_CONTEXT':
            response.data = this.context;
            break;
          case 'UPDATE_CONTEXT':
            this.context = { ...this.context, ...parsed.payload };
            break;
          case 'GET_STATE':
            response.data = this.state;
            break;
          case 'UPDATE_STATE':
            this.state = { ...this.state, ...parsed.payload };
            break;
          case 'GET_PLAN':
            console.log('[MCPServer] GET_PLAN received');
            response.data = this.plan;
            break;
          case 'UPDATE_PLAN':
            console.log('[MCPServer] UPDATE_PLAN received. Payload:', JSON.stringify(parsed.payload));
            if (this.isValidPlan(parsed.payload)) {
              this.plan = parsed.payload;
              response.success = true;
              response.data = this.plan;
            } else {
              response.success = false;
              response.error = 'Invalid plan payload';
              console.error('[MCPServer] Invalid plan payload:', JSON.stringify(parsed.payload));
            }
            break;
          case 'GET_GUIDELINES':
            console.log('[MCPServer] GET_GUIDELINES received');
            response.data = this.guidelines;
            break;
          case 'UPDATE_GUIDELINES':
            console.log('[MCPServer] UPDATE_GUIDELINES received. Payload:', JSON.stringify(parsed.payload));
            if (this.isValidGuidelines(parsed.payload)) {
              this.guidelines = parsed.payload;
              response.success = true;
              response.data = this.guidelines;
            } else {
              response.success = false;
              response.error = 'Invalid guidelines payload';
              console.error('[MCPServer] Invalid guidelines payload:', JSON.stringify(parsed.payload));
            }
            break;
          default:
            response.success = false;
            response.error = 'Unknown message type: ' + parsed.type;
            console.error('[MCPServer] Unknown message type:', parsed.type, 'Payload:', JSON.stringify(parsed.payload));
        }
      } catch (error) {
        response.success = false;
        response.error = (error as Error).message;
        console.error('[MCPServer] Exception in handleMessage:', error);
      }

      ws.send(JSON.stringify(response));
    } catch (err) {
      // Log error for auditability
      console.error('[MCPServer] Invalid message received:', message, err);
      // Send error response to client
      try {
        ws.send(JSON.stringify({ success: false, error: 'Invalid message format' }));
        console.log('[MCPServer] Sent error response for invalid message');
      } catch (sendErr) {
        console.error('[MCPServer] Failed to send error response:', sendErr);
      }
      // Close connection after error response
      try {
        ws.close(1003, 'Invalid message format'); // 1003 = unsupported data
        console.log('[MCPServer] Closed connection due to invalid message');
      } catch (closeErr) {
        console.error('[MCPServer] Failed to close connection:', closeErr);
      }
    }
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

  /**
   * Returns the actual port in use (OS-assigned if port was 0), otherwise config.port.
   * Annotated for audit and debugging.
   */
  public getPort(): number {
    if (typeof this.actualPort === 'number' && this.actualPort > 0) {
      return this.actualPort;
    }
    return this.config.port;
  }

  public stop(): void {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    this.clients.clear();
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