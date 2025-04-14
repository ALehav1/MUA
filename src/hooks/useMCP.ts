import { useEffect } from 'react';
import { mcpClient } from '../../mcp/client/mcpClient';

export const useMCP = () => {
  useEffect(() => {
    try {
      // Initialize MCP server
      mcpClient.getState();
    } catch (error) {
      console.error('Error initializing MCP:', error);
    }
  }, []);

  return {
    trackComponentAdded: (componentName: string, filePath: string, dependencies: string[] = []) => {
      try {
        mcpClient.trackComponentAdded(componentName, filePath, dependencies);
      } catch (error) {
        console.error('Error tracking component:', error);
      }
    },
    trackPerformance: (componentName: string, renderTime: number, mountTime: number, updateTime: number) => {
      try {
        mcpClient.trackPerformance(componentName, renderTime, mountTime, updateTime);
      } catch (error) {
        console.error('Error tracking performance:', error);
      }
    },
    trackStateChange: (componentName: string, stateKey: string, oldValue: any, newValue: any) => {
      try {
        mcpClient.trackStateChange(componentName, stateKey, oldValue, newValue);
      } catch (error) {
        console.error('Error tracking state change:', error);
      }
    },
    trackFileModified: (filePath: string, summary: string, changes: string[]) => {
      // Implementation for file modification tracking
    },
    trackDependencyAdded: (name: string, version: string, type: 'production' | 'development') => {
      // Implementation for dependency tracking
    },
    trackDocumentationUpdated: (file: string, type: 'added' | 'modified' | 'deleted', summary: string) => {
      // Implementation for documentation tracking
    },
    getState: () => {
      try {
        mcpClient.getState();
      } catch (error) {
        console.error('Error getting state:', error);
      }
    }
  };
}; 