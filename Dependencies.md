# Project Dependencies

## Core Dependencies
- React (^18.2.0)
- TypeScript (^5.3.3)
- Tailwind CSS (^3.4.1)
- React Router (^6.22.0)

## Development Dependencies
- Vite (^5.0.0)
- ESLint (^8.56.0)
- Prettier (^3.2.0)
- Jest (^29.7.0)
- React Testing Library (^14.1.0)

## Component Dependencies
- @headlessui/react (^1.7.0) - For accessible UI components
- @heroicons/react (^2.1.0) - For icons
- clsx (^2.1.0) - For conditional class names
- tailwind-merge (^2.2.0) - For merging Tailwind classes

## Mock Data Dependencies
- faker (^5.5.3) - For generating mock data
- date-fns (^2.30.0) - For date manipulation

## Project Structure Dependencies
```
mua/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Shared components
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature-specific components
│   ├── screens/           # Main application screens
│   ├── context/           # React Context providers
│   ├── data/              # Mock data and types
│   ├── styles/            # Global styles and Tailwind config
│   └── utils/             # Helper functions and utilities
```

## Component Relationships
- Dashboard depends on:
  - SubmissionList
  - FilterBar
  - SearchBar
- SubmissionDossier depends on:
  - RiskAnalysis
  - QuoteRecommendation
  - DocumentViewer
- AskMUA depends on:
  - QuestionInput
  - ResponseDisplay
  - SuggestionList

## Data Flow
1. Mock data is loaded from src/data/
2. Context providers manage state
3. Components consume and display data
4. User interactions update state
5. UI updates reflect changes 