import { MCPServer, ActionType, ActionPayloads } from '../../mcp/server/mcpServer';

class MCPClient {
  private server: MCPServer;

  constructor(port: number = 8080) {
    this.server = new MCPServer(port);
  }

  async trackComponentAdded(componentName: string, location: string, dependencies: string[]): Promise<void> {
    await this.server.processAction('COMPONENT_ADDED', {
      componentName,
      location,
      dependencies
    });
  }

  async trackFileModified(filePath: string, summary: string, changes: string[]): Promise<void> {
    await this.server.processAction('FILE_MODIFIED', {
      filePath,
      summary,
      changes
    });
  }

  async trackDependencyAdded(name: string, version: string, type: 'production' | 'development'): Promise<void> {
    await this.server.processAction('DEPENDENCY_ADDED', {
      name,
      version,
      type
    });
  }

  async trackDocumentationUpdated(file: string, type: 'added' | 'modified' | 'deleted', summary: string): Promise<void> {
    await this.server.processAction('DOCUMENTATION_UPDATED', {
      file,
      type,
      summary
    });
  }

  getState() {
    return this.server.getState();
  }

  getActionLog() {
    return this.server.getActionLog();
  }
}

export const mcpClient = new MCPClient(); 