// MCP Conversational Logging Utility (CommonJS)
// For use in Node.js scripts (e.g., integrationTest.mcp.cjs) to POST user prompts and assistant responses to the MCPMetaServer audit log.
// Cascade/Windsurf audit compliance. See README for details.

const http = require('http');

function postLog(endpoint, content) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ content });
    const options = {
      hostname: 'localhost',
      port: 8081,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = http.request(options, res => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => resolve(response));
    });
    req.on('error', err => {
      console.error(`[MCP] Logging failed (${endpoint}):`, err.message);
      reject(err);
    });
    req.write(data);
    req.end();
  });
}

module.exports = {
  /**
   * Log a user prompt to the MCP audit log.
   * @param {string} content
   */
  logUserPrompt: function(content) {
    return postLog('/logPrompt', content);
  },
  /**
   * Log an assistant (Cascade) response to the MCP audit log.
   * @param {string} content
   */
  logAssistantResponse: function(content) {
    return postLog('/logResponse', content);
  }
};
