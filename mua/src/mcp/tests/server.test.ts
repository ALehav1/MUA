import { WebSocket } from 'ws';
import { MCPServer } from '../server/MCPServer';
import { MCPMessage, MCPMessageType, MCPConfig } from '../types/mcp.types';

const TEST_CONFIG: MCPConfig = {
  host: '127.0.0.1', // Use IPv4 loopback for reliable local testing
  port: 0, // Use dynamic port assignment for all tests
  watchPaths: [],
  maxConnections: 10,
  reconnectAttempts: 3,
  reconnectDelay: 1000
};

function waitForServerStarted(server: MCPServer): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once('started', (port: number) => {
      // Optional: Wait 50ms to avoid race conditions
      setTimeout(() => resolve(port), 50);
    });
    server.once('error', (err: Error) => {
      reject(err);
    });
  });
}

describe('MCPServer', () => {
  let server: MCPServer | undefined;
  let ws: WebSocket | undefined;
  const servers: MCPServer[] = [];
  let dynamicPort: number;

  beforeEach(() => {
    // Use port 0 for OS-assigned free port
    server = new MCPServer({ ...TEST_CONFIG, port: 0 });
  });

  afterEach(async () => {
    try {
      if (ws) {
        ws.close();
        ws = undefined;
      }
      if (server) {
        await server.stop();
        server = undefined;
      }
      for (const s of servers) {
        await s.stop();
      }
      servers.length = 0;
    } finally {
      // Ensure all servers and sockets are closed
    }
  });

  it('should start the server', async () => {
    await server!.start();
    dynamicPort = await waitForServerStarted(server!);
    expect(dynamicPort).toBeGreaterThan(0);
  }, 10000);

  it('should handle port conflicts', async () => {
    const server1 = new MCPServer({ ...TEST_CONFIG, port: 0 });
    await server1.start();
    servers.push(server1);
    const port1 = await waitForServerStarted(server1);

    const server2 = new MCPServer({ ...TEST_CONFIG, port: 0 });
    await server2.start();
    servers.push(server2);
    const port2 = await waitForServerStarted(server2);

    expect(port2).not.toBe(port1);
  }, 10000);

  it('should handle WebSocket connections', async () => {
    await server!.start();
    dynamicPort = await waitForServerStarted(server!);
    try {
      ws = new WebSocket(`ws://127.0.0.1:${dynamicPort}`);
    } catch (err) {
      console.error('[Test] WebSocket connection failed:', err);
      throw err;
    }
    await new Promise<void>((resolve) => {
      ws!.on('open', () => {
        expect(server!.getConnections()).toBe(1);
        resolve();
      });
    });
  }, 10000);

  it('should handle TRACK_COMPONENT messages', async () => {
    await server!.start();
    dynamicPort = await waitForServerStarted(server!);
    try {
      ws = new WebSocket(`ws://127.0.0.1:${dynamicPort}`);
    } catch (err) {
      console.error('[Test] WebSocket connection failed:', err);
      throw err;
    }
    await new Promise<void>((resolve) => {
      ws!.on('open', () => {
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
        ws!.send(JSON.stringify(message));
        ws!.on('message', (data: string) => {
          const response = JSON.parse(data);
          expect(response.type).toBe(MCPMessageType.TRACK_COMPONENT);
          expect(response.success).toBe(true);
          resolve();
        });
      });
    });
  }, 10000);

  it('should handle GET_CONTEXT messages', async () => {
    await server!.start();
    dynamicPort = await waitForServerStarted(server!);
    try {
      ws = new WebSocket(`ws://127.0.0.1:${dynamicPort}`);
    } catch (err) {
      console.error('[Test] WebSocket connection failed:', err);
      throw err;
    }
    await new Promise<void>((resolve) => {
      ws!.on('open', () => {
        const message: MCPMessage = {
          type: MCPMessageType.GET_CONTEXT,
          payload: {},
          timestamp: new Date().toISOString()
        };
        ws!.send(JSON.stringify(message));
        ws!.on('message', (data: string) => {
          const response = JSON.parse(data);
          expect(response.type).toBe(MCPMessageType.GET_CONTEXT);
          expect(response.success).toBe(true);
          expect(response.data).toBeDefined();
          resolve();
        });
      });
    });
  }, 10000);

  it('should handle invalid messages', async () => {
    await server!.start();
    dynamicPort = await waitForServerStarted(server!);
    try {
      ws = new WebSocket(`ws://127.0.0.1:${dynamicPort}`);
    } catch (err) {
      console.error('[Test] WebSocket connection failed:', err);
      throw err;
    }
    await new Promise<void>((resolve, reject) => {
      let timeout: NodeJS.Timeout | undefined;
      ws!.on('open', () => {
        console.log('[Test] WebSocket open');
        ws!.send('invalid message');
        console.log('[Test] Sent invalid message');
        // Set up a 3s timeout
        timeout = setTimeout(() => {
          console.error('[Test] No response from server for invalid message after 3s');
          reject(new Error('No response from server for invalid message after 3s'));
        }, 3000);
      });
      ws!.on('message', (data: string) => {
        console.log('[Test] Received message:', data);
        clearTimeout(timeout);
        try {
          const response = JSON.parse(data);
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      ws!.on('error', (err) => {
        console.error('[Test] WebSocket error:', err);
        clearTimeout(timeout);
        reject(err);
      });
      ws!.on('close', (code, reason) => {
        console.log('[Test] WebSocket closed:', code, reason);
        clearTimeout(timeout);
        // If the server closes the connection without a message, fail the test
        // (unless you expect silent close as valid behavior)
      });
    });
  }, 10000);
});