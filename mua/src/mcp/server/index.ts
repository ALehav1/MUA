import { MCPServer } from './MCPServer.ts';
import { MCPConfig } from '@mcp/types/mcp.types';

const config: MCPConfig = {
  port: 8080,
  host: 'localhost',
  maxConnections: 100,
  reconnectAttempts: 5,
  reconnectDelay: 1000,
  watchPaths: []
};

const server = new MCPServer(config);

async function startServer() {
  try {
    // Await start in case it's async in the future; MCPServer.start is currently sync but this is safer for auditability
    server.start();
    console.log(`MCP server started at ws://${config.host}:${config.port}`);
  } catch (error: unknown) {
    console.error('Failed to start MCP server:', error);
    // Log all error details for debugging
    if (error && typeof error === 'object') {
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  await server.stop();
  process.exit(0);
});