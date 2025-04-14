# MUA - Monitoring and Usage Analytics

A React-based application with integrated Monitoring and Control Protocol (MCP) for real-time component tracking and analytics.

## Features

- Real-time component tracking
- WebSocket-based communication
- TypeScript support
- Modern React architecture
- Tailwind CSS styling
- ESLint and Prettier configuration

## Project Structure

```
mua/
├── src/                 # Frontend source code
│   ├── components/     # React components
│   ├── screens/        # Page components
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   ├── context/        # React context providers
│   ├── types/          # TypeScript type definitions
│   └── styles/         # CSS and styling
├── mcp/                # MCP implementation
│   ├── client/         # MCP client code
│   ├── server/         # MCP server code
│   ├── types/          # MCP type definitions
│   ├── utils/          # MCP utilities
│   └── models/         # Data models
├── public/             # Static assets
└── tests/              # Test files
```

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mua.git
cd mua
```

2. Install dependencies:
```bash
npm install
```

## Development

1. Start the MCP server:
```bash
npm run mcp-server
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application:
- Frontend: http://localhost:3002
- MCP Server: http://localhost:8080

## Building for Production

```bash
npm run build
```

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 