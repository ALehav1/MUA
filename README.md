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

## Project Structure
```
mua/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── screens/           # Main application screens
│   ├── context/           # React Context providers
│   ├── data/              # Mock data and types
│   ├── styles/            # Global styles and Tailwind config
│   └── utils/             # Helper functions and utilities
├── public/                # Static assets
├── docs/                  # Project documentation
└── tests/                 # Test files
```

## Core Features Implementation

### 1. Dashboard Screen
- Submission overview table
- Sorting and filtering capabilities
- Navigation to submission details

### 2. Submission Dossier Screen
- Comprehensive submission overview
- Tabbed navigation for different sections
- Interactive risk analysis display
- Quote recommendation interface

### 3. "Ask MUA" Feature
- Interactive Q&A interface
- Pre-defined question suggestions
- Mock response system

## Development Guidelines
1. Mobile-first responsive design
2. Component-based architecture
3. Clear separation of concerns
4. Comprehensive documentation
5. Regular testing and validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

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