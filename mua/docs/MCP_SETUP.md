# Model Context Protocol (MCP) Setup Guide

## Project Structure
The MCP implementation must follow this exact directory structure:

```
mua/                      # Root project directory
├── src/                  # React application source
│   ├── hooks/            # React hooks
│   │   └── useMCP.ts     # MCP React hook
│   └── utils/            # Utility functions
│       └── mcpClient.ts  # MCP client implementation
│
└── mcp/                  # MCP server implementation
    ├── server/           # Server-side code
    │   ├── mcpServer.ts  # Main server implementation
    │   └── index.ts      # Server entry point
    ├── types/            # TypeScript type definitions
    │   └── mcpTypes.ts   # MCP type definitions
    ├── models/           # Data models
    ├── utils/            # Utility functions
    └── handlers/         # Message and error handlers
```

## Important Notes
1. **Directory Location**: All MCP-related files must be created within the `mua` directory, NOT in the root directory.
2. **Import Paths**: When importing MCP files in React components, use relative paths from the `src` directory.
3. **Server Location**: The MCP server must be started from the `mua` directory.

## Setup Steps

### 1. Verify Directory Structure
Before starting, ensure you're in the correct directory:
```bash
cd /Users/arilehavi/Desktop/Coding Projects/MUA/mua
```

### 2. Install Dependencies
```bash
npm install typescript ts-node @types/node ws @types/ws
```

### 3. Configure TypeScript
Create or update `mcp/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./",
    "declaration": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create MCP Files
Create these files in the EXACT locations shown:

1. `src/hooks/useMCP.ts`:
```typescript
import { useEffect } from 'react';
import { mcpClient } from '../utils/mcpClient';

export const useMCP = () => {
  const trackComponentAdded = (
    componentName: string,
    filePath: string,
    dependencies: string[]
  ) => {
    useEffect(() => {
      mcpClient.trackComponentAdded(componentName, filePath, dependencies);
    }, [componentName, filePath, dependencies]);
  };

  return {
    trackComponentAdded
  };
};
```

2. `src/utils/mcpClient.ts`:
```typescript
import { MCPMessageType } from '../../mcp/types/mcpTypes';

class MCPClient {
  private ws: WebSocket;
  private messageQueue: any[] = [];
  private isConnected: boolean = false;
  private readonly maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;
  private readonly reconnectDelay: number = 1000;

  constructor() {
    this.ws = new WebSocket('ws://localhost:8080');
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.ws.onopen = () => {
      console.log('Connected to MCP server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.processMessageQueue();
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from MCP server');
      this.isConnected = false;
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.ws = new WebSocket('ws://localhost:8080');
        this.setupWebSocket();
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private sendMessage(message: any) {
    if (this.isConnected) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  public trackComponentAdded(componentName: string, filePath: string, dependencies: string[]) {
    this.sendMessage({
      type: MCPMessageType.COMPONENT_ADDED,
      payload: {
        componentName,
        filePath,
        dependencies
      },
      timestamp: Date.now(),
      source: 'client'
    });
  }
}

export const mcpClient = new MCPClient();
```

3. `mcp/types/mcpTypes.ts`:
```typescript
export enum MCPMessageType {
  FILE_MODIFIED = 'FILE_MODIFIED',
  COMPONENT_ADDED = 'COMPONENT_ADDED',
  DEPENDENCY_ADDED = 'DEPENDENCY_ADDED',
  DOCUMENTATION_UPDATED = 'DOCUMENTATION_UPDATED',
  TEST_ADDED = 'TEST_ADDED',
  CONFIG_CHANGED = 'CONFIG_CHANGED',
  INITIAL_STATE_VALIDATION = 'INITIAL_STATE_VALIDATION'
}

export interface MCPMessage {
  type: MCPMessageType;
  payload: any;
  timestamp: number;
  source: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}
```

### 5. Starting the Server
Add this script to `mua/package.json`:
```json
{
  "scripts": {
    "mcp:server": "cd mcp && ts-node server/index.ts"
  }
}
```

Run the server:
```bash
npm run mcp:server
```

### 6. Common Issues and Solutions

#### Directory Structure Issues
- **Problem**: Files created in wrong location
- **Solution**: Always create files in the `mua` directory, not the root directory

#### Import Path Issues
- **Problem**: Import paths not resolving
- **Solution**: Use relative paths from the `src` directory for React components

#### TypeScript Configuration
- **Problem**: TypeScript errors in MCP server
- **Solution**: Ensure `mcp/tsconfig.json` is properly configured

### 7. Best Practices

1. **Directory Structure**
   - Always work in the `mua` directory
   - Follow the exact directory structure shown above
   - Double-check file locations before creating new files

2. **Import Paths**
   - Use relative paths from the current file's location
   - Verify import paths work before committing changes

3. **Type Safety**
   - Keep type definitions in `mcp/types`
   - Update types when adding new features

4. **Documentation**
   - Update this guide when making structural changes
   - Document any deviations from the standard structure

## Troubleshooting

### Server Won't Start
1. Check if port 8080 is available
2. Verify TypeScript configuration
3. Check for syntax errors in server code

### Client Connection Issues
1. Verify server is running
2. Check WebSocket URL configuration
3. Look for network/firewall issues

### Type Errors
1. Update TypeScript configuration
2. Check type definitions
3. Verify all required types are exported

## Maintenance

### Regular Tasks
1. Update dependencies
2. Review and update documentation
3. Check for and fix any type errors
4. Monitor server logs for issues

### Version Control
1. Keep track of changes in version control
2. Document breaking changes
3. Maintain backward compatibility where possible 