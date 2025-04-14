# Moody's Underwriting Assistant (MUA)

## Project Overview
MUA is an interactive frontend prototype designed to assist commercial casualty underwriters in their decision-making process. The tool provides a comprehensive view of submission data, risk analysis, and quote recommendations.

## Development Phases

### Phase 1: Frontend UI/UX Build with Mock Data
- Build complete UI/UX flows using mock data
- Focus on visual presentation and navigation
- Implement all core screens and components
- No backend integration required

### Phase 2: Future Integration (Out of Scope for Now)
- Potential mock API endpoints
- Dynamic data retrieval simulation

## Technology Stack
- Frontend Framework: React
- Styling: Tailwind CSS
- State Management: React Context API
- Component Architecture: Functional Components with Hooks
- Development Monitoring: Model Context Protocol (MCP)

## Project Structure
```
mua/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── screens/           # Main application screens
│   ├── context/           # React Context providers
│   ├── data/              # Mock data and types
│   ├── styles/            # Global styles and Tailwind config
│   ├── utils/             # Helper functions and utilities
│   ├── hooks/             # Custom React hooks
│   └── routes/            # React Router configuration
├── mcp/                   # Model Context Protocol
│   ├── client/           # MCP client implementation
│   ├── server/           # MCP server implementation
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/                # Static assets
├── docs/                  # Project documentation
└── tests/                 # Test files
```

## MCP Setup and Usage

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- TypeScript (v4 or higher)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install MCP-specific dependencies:
   ```bash
   npm install --save-dev @types/node
   ```

### Running the Application
1. Start the MCP server in one terminal:
   ```bash
   npm run mcp:server
   ```
   The MCP server will run on port 8080.

2. Start the development server in another terminal:
   ```bash
   npm run dev
   ```
   The application will run on port 3001 (or another available port if 3000 is in use).

### Common Issues and Solutions

1. **MCP Server Connection Issues**
   - Ensure the MCP server is running before starting the application
   - Check that port 8080 is available
   - Verify WebSocket connection in browser console

2. **TypeScript Errors**
   - If you see "Cannot find module 'node:events'", run:
     ```bash
     npm install --save-dev @types/node
     ```
   - If you see "Property 'getState' does not exist", ensure the MCP client has the correct method implementations

3. **Component Tracking Issues**
   - Ensure components use the `useMCP` hook correctly
   - Verify component paths in tracking calls
   - Check for proper error handling in MCP client

### Version Control Guidelines
1. Commit frequently with descriptive messages
2. Follow the format: "feat: description" for features, "fix: description" for bug fixes
3. Include MCP-related changes in commit messages when applicable
4. Document any MCP configuration changes in the commit message

## Core Features Implementation

### 1. Dashboard Screen
- Submission overview table
- Sorting and filtering capabilities
- Navigation to submission details
- MCP component tracking

### 2. Submission Dossier Screen
- Comprehensive submission overview
- Tabbed navigation for different sections
- Interactive risk analysis display
- Quote recommendation interface
- MCP performance monitoring

### 3. "Ask MUA" Feature
- Interactive Q&A interface
- Pre-defined question suggestions
- Mock response system
- MCP interaction tracking

## Development Guidelines
1. Mobile-first responsive design
2. Component-based architecture
3. Clear separation of concerns
4. Comprehensive documentation
5. Regular testing and validation
6. MCP integration and monitoring
7. Error boundary implementation
8. TypeScript strict mode compliance

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- TypeScript (v4 or higher)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Running Tests
```bash
npm test
```

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details 