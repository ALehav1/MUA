import { createContext } from 'react';

export interface MCPContextType {
  isConnected: boolean;
  trackComponentAdded: (componentId: string, filePath: string, dependencies: string[]) => Promise<void>;
  trackComponentRemoved: (componentId: string) => Promise<void>;
  trackComponentUpdated: (componentId: string, filePath: string, dependencies: string[]) => Promise<void>;
  getComponentContext: (componentId: string) => Promise<void>;
}

export const MCPContext = createContext<MCPContextType | null>(null);
