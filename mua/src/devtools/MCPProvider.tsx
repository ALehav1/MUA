// DEVELOPER NOTE: This file is part of the Model Context Protocol (MCP) developer/automation tooling.
// MCP is NOT a user-facing feature of MUA. It is used for development, automation, and agent integration only.
// Do NOT expose any MCP-related features to end users.
//
// CANONICAL IMPORTS ONLY:
// Always import MCPClient from '@mcp/client/MCPClient' and MCP types from '@mcp/types/mcp.types'.
// Do NOT import from deprecated files such as src/types/mcpTypes.ts.

// Removed unused createContext and useContext imports
import React, { useEffect, useMemo, useState } from 'react';
import { MCPClient } from '@mcp/client/MCPClient';
import { MCPMessageType, MCPMessage } from '@mcp/types/mcp.types';
import { MCPContext, MCPContextType } from '../components/MCPContext';

interface MCPProviderProps {
  children: React.ReactNode;
}

export const MCPProvider: React.FC<MCPProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const mcpClient = useMemo(() => new MCPClient('ws://localhost:3000'), []);

  useEffect(() => {
    const connectToMCP = async () => {
      try {
        await mcpClient.connect();
        setIsConnected(true);
        console.log('Connected to MCP server');
      } catch (error) {
        console.error('Failed to connect to MCP server:', error);
      }
    };

    connectToMCP();

    return () => {
      mcpClient.disconnect();
    };
  }, [mcpClient]);

  const trackComponentAdded = async (componentId: string, filePath: string, dependencies: string[]) => {
    if (!isConnected) return;

    try {
      const message: MCPMessage = {
        type: MCPMessageType.TRACK_COMPONENT,
        timestamp: new Date().toISOString(),
        payload: {
          componentId,
          filePath,
          dependencies
        }
      };
      mcpClient.send(message);
    } catch (error) {
      console.error('Failed to track component:', error);
    }
  };

  const trackComponentRemoved = async (componentId: string): Promise<void> => {
    try {
      const message: MCPMessage = {
        type: MCPMessageType.TRACK_COMPONENT,
        timestamp: new Date().toISOString(),
        payload: { componentId, action: 'removed' }
      };
      mcpClient.send(message);
    } catch (error) {
      console.error('Error tracking component removal:', error);
    }
  };

  const trackComponentUpdated = async (componentId: string): Promise<void> => {
    try {
      const message: MCPMessage = {
        type: MCPMessageType.TRACK_COMPONENT,
        timestamp: new Date().toISOString(),
        payload: { componentId, action: 'updated' }
      };
      mcpClient.send(message);
    } catch (error) {
      console.error('Error tracking component update:', error);
    }
  };

  const getComponentContext = async (componentId: string): Promise<void> => {
    if (!isConnected) {
      throw new Error('Not connected to MCP server');
    }

    try {
      const message: MCPMessage = {
        type: MCPMessageType.GET_CONTEXT,
        timestamp: new Date().toISOString(),
        payload: { componentId }
      };
      mcpClient.send(message);
    } catch (error) {
      console.error('Failed to get component context:', error);
      throw error;
    }
  };

  const value: MCPContextType = {
    isConnected,
    trackComponentAdded,
    trackComponentRemoved,
    trackComponentUpdated,
    getComponentContext,
  };

  return (
    <MCPContext.Provider value={value}>
      {children}
    </MCPContext.Provider>
  );
};

export default MCPProvider;

// Developer Note: Do not use this provider in user-facing components/screens.
// Only for devtools/automation.
