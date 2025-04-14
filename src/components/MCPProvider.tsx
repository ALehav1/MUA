import React, { createContext, useContext, useEffect, useState } from 'react';
import MCPServer from '../../mcp/server/mcpServer';

interface MCPContextType {
  server: MCPServer;
  state: {
    components: Map<string, any>;
    interactions: any[];
    dataFlows: any[];
    performanceMetrics: any[];
  };
}

const MCPContext = createContext<MCPContextType | null>(null);

export const useMCP = () => {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCP must be used within an MCPProvider');
  }
  return context;
};

export const MCPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [server] = useState(() => new MCPServer());
  const [state, setState] = useState({
    components: new Map(),
    interactions: [],
    dataFlows: [],
    performanceMetrics: []
  });

  useEffect(() => {
    // Start the MCP server
    server.start().catch(console.error);

    // Listen for state changes
    const handleStateChange = (newState: any) => {
      setState(prev => ({ ...prev, ...newState }));
    };

    server.on('stateChanged', handleStateChange);

    // Cleanup
    return () => {
      server.removeListener('stateChanged', handleStateChange);
    };
  }, [server]);

  return (
    <MCPContext.Provider value={{ server, state }}>
      {children}
    </MCPContext.Provider>
  );
}; 