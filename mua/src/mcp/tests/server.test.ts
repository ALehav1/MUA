import { WebSocket } from 'ws';
import { MCPServer } from '../server/MCPServer';
import { MCPMessage, MCPMessageType, MCPConfig } from '../types/mcp.types';

const TEST_PORT = 3001;
const TEST_CONFIG: MCPConfig = {
  port: TEST_PORT,
  host: 'localhost',
  watchPaths: [],
  maxConnections: 10,
  reconnectAttempts: 3,
  reconnectDelay: 1000
};

describe('MCPServer', () => {
  let server: MCPServer;
  let ws: WebSocket;

  beforeEach(() => {
    server = new MCPServer(TEST_CONFIG);
  });

  afterEach(async () => {
    if (ws) {
      ws.close();
    }
    await server.stop();
  });

  it('should start the server', async () => {
    await server.start();
    expect(server.getPort()).toBe(TEST_PORT);
  });

  it('should handle port conflicts', async () => {
    const server1 = new MCPServer(TEST_CONFIG);
    await server1.start();

    const server2 = new MCPServer(TEST_CONFIG);
    await server2.start();

    expect(server2.getPort()).toBe(TEST_PORT + 1);
    await server1.stop();
    await server2.stop();
  });

  it('should handle WebSocket connections', async () => {
    await server.start();
    ws = new WebSocket(`ws://localhost:${TEST_PORT}`);

    await new Promise<void>((resolve) => {
      ws.on('open', () => {
        expect(server.getConnections()).toBe(1);
        resolve();
      });
    });
  });

  it('should handle TRACK_COMPONENT messages', async () => {
    await server.start();
    ws = new WebSocket(`ws://localhost:${TEST_PORT}`);

    await new Promise<void>((resolve) => {
      ws.on('open', () => {
        const message: MCPMessage = {
          type: MCPMessageType.TRACK_COMPONENT,
          payload: {
            id: 'test-component',
            name: 'TestComponent',
            type: 'Test',
            props: {},
            state: {},
            children: []
          },
          timestamp: new Date().toISOString()
        };

        ws.send(JSON.stringify(message));

        ws.on('message', (data: string) => {
          const response = JSON.parse(data);
          expect(response.type).toBe(MCPMessageType.TRACK_COMPONENT);
          expect(response.success).toBe(true);
          resolve();
        });
      });
    });
  });

  it('should handle GET_CONTEXT messages', async () => {
    await server.start();
    ws = new WebSocket(`ws://localhost:${TEST_PORT}`);

    await new Promise<void>((resolve) => {
      ws.on('open', () => {
        const message: MCPMessage = {
          type: MCPMessageType.GET_CONTEXT,
          payload: {},
          timestamp: new Date().toISOString()
        };

        ws.send(JSON.stringify(message));

        ws.on('message', (data: string) => {
          const response = JSON.parse(data);
          expect(response.type).toBe(MCPMessageType.GET_CONTEXT);
          expect(response.success).toBe(true);
          expect(response.data).toBeDefined();
          resolve();
        });
      });
    });
  });

  it('should handle invalid messages', async () => {
    await server.start();
    ws = new WebSocket(`ws://localhost:${TEST_PORT}`);

    await new Promise<void>((resolve) => {
      ws.on('open', () => {
        ws.send('invalid message');

        ws.on('message', (data: string) => {
          const response = JSON.parse(data);
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          resolve();
        });
      });
    });
  });
}); 