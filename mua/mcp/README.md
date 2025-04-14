# Model Context Protocol (MCP) Server

The MCP Server is a context management system designed to maintain project state, track changes, and ensure consistency across the Moody's Underwriting Assistant (MUA) project.

## Purpose
- Maintain project context and state
- Track changes and actions across the project
- Validate project consistency
- Automate documentation updates
- Monitor dependencies and component relationships

## Structure
```
mcp/
├── server/              # MCP Server implementation
│   └── mcpServer.ts     # Main server class
├── models/              # Type definitions
│   └── types.ts         # Core type interfaces
├── utils/               # Utility functions
│   └── contextUtils.ts  # Context management utilities
└── README.md           # This documentation
```

## Core Components

### 1. MCP Server (`mcpServer.ts`)
- Main server class that manages project state
- Event emitter for tracking actions
- Context initialization and updates
- Action processing and validation

### 2. Types (`types.ts`)
- Project context interfaces
- Repository state tracking
- Action logging
- Configuration types
- Validation rules

### 3. Utilities (`contextUtils.ts`)
- Action validation
- Change tracking
- Documentation updates
- Dependency validation
- Component consistency checks

## Usage

### Initialization
```typescript
import { MCPServer } from './server/mcpServer';
import { MCPConfig } from './models/types';

const config: MCPConfig = {
  projectRoot: process.cwd(),
  documentationPath: './docs',
  maxActionLogSize: 1000,
  validationRules: generateValidationRules()
};

const mcp = new MCPServer(config);
```

### Tracking Changes
```typescript
// Track a file modification
await mcp.processAction('FILE_MODIFIED', {
  filePath: 'src/components/Button.tsx',
  summary: 'Updated button styling'
});

// Track a new component
await mcp.processAction('COMPONENT_ADDED', {
  componentName: 'SubmitButton',
  location: 'src/components/'
});
```

### Event Handling
```typescript
mcp.on('actionProcessed', (action) => {
  console.log(`Action processed: ${action.action}`);
});

mcp.on('error', (error) => {
  console.error('MCP Error:', error);
});
```

## Integration with Main Project

The MCP server is designed to work alongside the main MUA project:
1. Tracks changes in the main project
2. Maintains documentation consistency
3. Validates project structure
4. Monitors dependencies

## Best Practices
1. Always process actions through the MCP server
2. Keep documentation in sync with changes
3. Validate dependencies before adding new ones
4. Monitor component consistency
5. Use appropriate action types for different changes

## Action Types
- `FILE_MODIFIED`: Track file changes
- `COMPONENT_ADDED`: New component creation
- `DEPENDENCY_ADDED`: New dependency addition
- `DOCUMENTATION_UPDATED`: Documentation changes
- `TEST_ADDED`: New test implementation
- `CONFIG_CHANGED`: Configuration updates

## Error Handling
- All actions are validated before processing
- Errors are emitted through the error event
- Failed actions are logged but don't stop execution
- Validation rules can be customized per project needs 