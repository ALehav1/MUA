import { useCallback, useEffect, useRef } from "react";
import { mcpClient } from "../utils/mcpClient";

export const useMCP = () => {
  const wsRef = useRef<WebSocket | null>(null);

  const trackComponentAdded = useCallback((
    componentName: string,
    filePath: string,
    dependencies: string[]
  ) => {
    mcpClient.trackComponentAdded(componentName, filePath, dependencies);
  }, []);

  useEffect(() => {
    // Initialize MCP client connection
    wsRef.current = mcpClient.getWebSocket();

    return () => {
      // Cleanup MCP client connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    trackComponentAdded
  };
};

export default useMCP; 