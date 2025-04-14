import { MCPServer } from './mcpServer';
import { logger } from '../utils/logger';

const PORT = process.env.MCP_PORT ? parseInt(process.env.MCP_PORT) : 8080;

async function startServer() {
  try {
    const server = new MCPServer(PORT);
    await server.start();
    logger.info(`MCP Server started on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start MCP Server:', error);
    process.exit(1);
  }
}

startServer(); 