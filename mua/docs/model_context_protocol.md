# Model Context Protocol

This guide serves as a detailed roadmap for developing a full-stack application, emphasizing a **UX-first approach** where user experience drives every decision. It covers all phases of development—from planning and setup to deployment and maintenance—providing explicit instructions for project structure, coding standards, testing, version control, dependency management, API integration, state management, error handling, deployment workflows, and environment management.

## Development Phases

The project is divided into three distinct phases to maintain focus on UX while ensuring a logical progression from frontend to backend to advanced features.

### Phase 1: UX & User Journey Development
- **Goal**: Establish a solid UX foundation before backend work begins
- **Steps**:
  1. Document all user journeys in `docs/user-journeys/`
  2. Create UI mockups using tools like Balsamiq, Sketch, or Adobe XD
  3. Build the frontend with mock data to simulate real interactions
  4. Validate UX with stakeholders through reviews and iterations

### Phase 2: Backend & Data Integration
- **Goal**: Connect the frontend to a functional backend with real data
- **Steps**:
  1. Design and implement backend services and API endpoints
  2. Set up the database with schemas and initial data
  3. Replace frontend mock data with API calls
  4. Validate data integrity and error handling across the stack

### Phase 3: Advanced Features & Optimization
- **Goal**: Enhance the application with critical features and polish
- **Steps**:
  1. Add authentication, authorization, and user roles
  2. Optimize performance (e.g., lazy loading, caching)
  3. Ensure accessibility (e.g., screen reader support)
  4. Implement security measures (e.g., input sanitization, HTTPS)
  5. Integrate analytics and monitoring for post-launch insights

## Project Structure

A well-organized directory structure is the backbone of a maintainable project. Below is a detailed setup with explanations for each component.

```
project-name/
├── frontend/                    # Client-side application (React + TypeScript)
│   ├── config/                  # Build and tooling configs
│   │   ├── vite.config.ts       # Vite configuration
│   │   ├── .eslintrc.js         # ESLint rules
│   │   └── jest.config.ts       # Jest setup
│   ├── public/                  # Static assets
│   ├── src/                     # Frontend source code
│   │   ├── components/          # UI building blocks
│   │   ├── hooks/               # Custom hooks
│   │   ├── contexts/            # React contexts
│   │   ├── services/            # API interaction logic
│   │   ├── utils/               # Helper functions
│   │   ├── types/               # TypeScript types
│   │   ├── mocks/               # Mock data for Phase 1
│   │   ├── assets/              # Images, fonts, CSS
│   │   ├── pages/               # Top-level page components
│   │   ├── routes/              # Routing config
│   │   └── __tests__/           # Frontend tests
│   ├── package.json             # Frontend dependencies
│   └── tsconfig.json            # TypeScript configuration
├── backend/                     # Server-side application
│   ├── config/                  # Backend configurations
│   ├── app.py                   # Main app entry point
│   ├── routes/                  # API endpoints
│   ├── services/                # Business logic
│   ├── models/                  # Data models
│   ├── utils/                   # Helpers
│   ├── tests/                   # Backend tests
│   └── requirements.txt         # Python dependencies
├── docs/                        # Project documentation
│   ├── architecture/            # Architectural decisions
│   ├── api/                     # API specs
│   ├── deployment/              # Deployment guides
│   └── user-journeys/           # User journey docs
├── scripts/                     # Automation scripts
├── .env.development             # Dev environment variables
├── .env.staging                 # Staging environment variables
├── .env.production              # Production environment variables
├── .env.example                 # Template for env vars
├── .gitignore                   # Files to ignore in Git
├── README.md                    # Project overview
├── DEPLOYMENT.md                # Deployment steps
├── ARCHITECTURE.md              # System architecture
└── plan.md                      # Development roadmap
```

## Dependency Management

### Frontend Dependencies
- Use `package.json` with pinned version numbers
- Include `.nvmrc` to lock Node.js version
- Document all dependencies in `Dependencies.md`

### Backend Dependencies
- Use `requirements.txt` with pinned version numbers
- Document Python version requirements
- Include development dependencies separately

## Configuration Management

### Environment Variables
- Document all required environment variables in `.env.example`
- Create separate `.env` files for each environment
- Never commit sensitive environment variables

### Design System Documentation
- Document UI component standards in `docs/design-system/`
- Include design tokens (colors, spacing, typography)
- Maintain a component library with Storybook

## Development Tooling

### Linting and Formatting
- Configure ESLint in `.eslintrc.js`
- Configure Prettier in `.prettierrc`
- Set up pre-commit hooks for code quality

### IDE Setup
- Document recommended IDE extensions
- Share formatting configurations
- Include debugging configurations

## Containerization

### Docker Configuration
- Create `Dockerfile` for development
- Create `docker-compose.yml` for local setup
- Document containerization process

## Version Control Strategy

### Branching Model
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Fixes
- `hotfix/*`: Urgent production fixes

### Commit Messages
- Format: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Keep messages concise but descriptive

## Testing Guidelines

### Phase-Specific Testing
1. **Phase 1**: Component tests with mock data
2. **Phase 2**: API and integration tests
3. **Phase 3**: E2E and performance tests

### Coverage Requirements
- Aim for 80%+ unit test coverage
- 100% coverage for critical paths
- Document test strategy in `docs/testing/`

## Error Handling

### Frontend Error Handling
- Implement error boundaries
- Show user-friendly error messages
- Log errors for debugging

### Backend Error Handling
- Use global exception handlers
- Return appropriate HTTP status codes
- Log errors with context

## API Integration

### API Client
- Create reusable API client
- Implement proper error handling
- Document API endpoints

### Mock Data Strategy
- Store mock data in `frontend/src/mocks/`
- Create mock API responses
- Document mock data structure

## State Management

### Component-Level State
- Use React hooks for local state
- Keep state as close to usage as possible

### Global State
- Use Context API for feature-specific state
- Consider Redux for complex global state
- Document state management decisions

## Deployment Workflows

### CI/CD Pipeline
- Set up GitHub Actions workflow
- Include linting, testing, and building
- Deploy to staging and production

### Deployment Scripts
- Create deployment scripts in `scripts/`
- Document deployment process
- Include rollback procedures

## Development Optimization

### Development Tools
- Use Madge for dependency visualization
- Implement hot reloading
- Set up debugging tools

### Performance Optimization
- Implement lazy loading
- Use code splitting
- Optimize assets

## Common Challenges and Solutions

### CORS Configuration
- Document CORS setup
- Include development and production settings

### Database Migrations
- Use Alembic for Python projects
- Document migration process
- Include rollback procedures

### Dependency Conflicts
- Use dependency audit tools
- Document resolution process
- Maintain version compatibility

## Lessons Learned

- Always search for existing code before writing new
- Test updates to shared components across all dependents
- Commit small changes frequently with clear messages
- Document architectural decisions
- Keep user journeys in focus
- Maintain comprehensive documentation 