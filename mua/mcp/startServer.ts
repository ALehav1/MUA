import { MCPServer } from './server/mcpServer';
import { logger } from './utils/logger';

async function startServer() {
  try {
    const server = new MCPServer(8080);
    await server.start();
    logger.info('MCP Server started successfully');
  } catch (error) {
    logger.error('Failed to start MCP Server:', error);
    process.exit(1);
  }
}

startServer(); 