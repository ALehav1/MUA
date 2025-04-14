import { useCallback, useEffect } from "react";
import { mcpClient } from "../utils/mcpClient";

export const useMCP = () => {
  const trackComponentAdded = useCallback((componentName: string, filePath: string, dependencies: string[]) => {
    mcpClient.trackComponentAdded(componentName, filePath, dependencies);
  }, []);

  useEffect(() => {
    // Initialize MCP client connection
    const ws = mcpClient.getWebSocket();

    return () => {
      // Cleanup MCP client connection
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return {
    trackComponentAdded
  };
};

export default useMCP; 