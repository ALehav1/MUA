import { MCPServer } from './MCPServer';
import { MCPConfig } from '@mcp/types/mcp.types';

// ---
// Unified startup: Import and start REST audit server (MCPMetaServer)
// This ensures both the WebSocket and REST servers are started for audit compliance and onboarding clarity.
import app from './MCPMetaServer';

/**
 * MCPConfig details:
 * - port: Set to 0 for dynamic port assignment (recommended for tests/dev), or a fixed port for production.
 * - host: Use '127.0.0.1' for local dev/testing; '0.0.0.0' to listen on all interfaces (prod).
 * - maxConnections: Maximum concurrent WebSocket clients.
 * - reconnectAttempts/reconnectDelay: Client reconnection policy.
 * - watchPaths: Optional, for file watching/notifications.
 *
 * ---
 * MCP Audit Log (data/audit.json):
 *   - Strictly a developer tool for tracking agent/assistant development, debugging, and compliance audits.
 *   - NOT for logging end-user application usage or production conversations.
 *   - Use /logPrompt and /logResponse endpoints only in test/dev workflows, not in production user flows.
 *   - For production analytics or audit, implement a separate, privacy-compliant logging solution as needed.
 *   - See README for full audit log guidance and best practices.
 * ---
 * Selective Logging Policy (Cascade agent chat):
 *   - All user prompts/instructions are logged in full to the MCP audit log.
 *   - Assistant (Cascade) responses are logged as a summary (first 200 chars) by default.
 *   - Full responses are logged only if flagged or if they contain errors.
 *   - See README for code sample and integration details.
 * ---
 *
 * For dynamic port assignment, pass port: 0. The actual port will be available via server.getPort() after startup.
 *
 * For audit logging, ensure REST audit server (MCPMetaServer) is running alongside the WebSocket server.
 */
const config: MCPConfig = {
  port: 8080, // Change to 0 for dynamic assignment in tests/dev
  host: '127.0.0.1', // Use '127.0.0.1' for local dev/tests, '0.0.0.0' for all interfaces
  maxConnections: 100,
  reconnectAttempts: 5,
  reconnectDelay: 1000,
  watchPaths: []
};

const server = new MCPServer(config);

/**
 * Starts both the MCP WebSocket server and the REST audit server.
 * The REST audit server logs all conversational events to data/audit.json for compliance.
 */
async function startServer() {
  try {
    // Start MCP WebSocket server
    server.start();
    console.log(`MCP server started at ws://${config.host}:${config.port} (actual: ws://${config.host}:${server.getPort()})`);
    // Start REST audit server on 8081
    const REST_PORT = 8081;
    app.listen(REST_PORT, () => {
      console.log(`[MCPMetaServer] REST server running on http://localhost:${REST_PORT}`);
    });
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