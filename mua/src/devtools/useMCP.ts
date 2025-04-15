// DEVELOPER NOTE: This file is part of the Model Context Protocol (MCP) developer/automation tooling.
// MCP is NOT a user-facing feature of MUA. It is used for development, automation, and agent integration only.
// Do NOT expose any MCP-related features to end users.

export * from '../hooks/useMCP';

// --- Conversational Logging Utilities (MCP) ---
// These functions POST to MCPMetaServer to log user prompts and assistant responses for auditability.
// Only used in devtools/agentic workflows (not user-facing UI).

/**
 * Log a user prompt to the MCP audit log.
 * @param content The prompt content (string)
 */
export async function logUserPrompt(content: string) {
  try {
    await fetch('http://localhost:8081/logPrompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    // Log error for audit/debug
    console.error('[MCP] Failed to log user prompt:', error);
  }
}

/**
 * Log an assistant (Cascade) response to the MCP audit log.
 * @param content The response content (string)
 */
export async function logAssistantResponse(content: string) {
  try {
    await fetch('http://localhost:8081/logResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    // Log error for audit/debug
    console.error('[MCP] Failed to log assistant response:', error);
  }
}

// --- End Conversational Logging Utilities ---
