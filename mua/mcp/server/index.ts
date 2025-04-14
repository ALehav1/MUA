import { MCPServer } from './mcpServer';

const server = new MCPServer();
console.log('[INFO] Starting MCP server...');
server.start();
console.log('[INFO] MCP Server started on port 8080'); 