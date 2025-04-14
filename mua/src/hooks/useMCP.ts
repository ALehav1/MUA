import { useCallback } from "react";
import { mcpClient } from "@mcp/client/mcpClient";
import { MCPMessageType, MCPMessage } from '@mcp/types/mcpTypes';

export const useMCP = () => {
  const trackComponentAdded = useCallback((componentName: string, filePath: string, dependencies: string[]) => {
    mcpClient.sendMessage({
      type: MCPMessageType.COMPONENT_ADDED,
      payload: {
        componentName,
        filePath,
        dependencies
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const sendMessage = (message: MCPMessage) => {
    mcpClient.sendMessage(message);
  };

  return {
    trackComponentAdded,
    sendMessage
  };
};

export default useMCP; 