# AGENT.md - Cold Case React App

## Commands
- Dev server: `yarn dev` or `npm run dev`
- Build: `yarn build` or `npm run build` 
- Lint: `yarn lint` or `npm run lint`
- Preview: `yarn preview` or `npm run preview`
- Type check: `tsc -b`

## Architecture
- React + TypeScript + Vite app showcasing BC cold cases
- Bootstrap UI framework with react-bootstrap components
- Cases loaded from both `/src/data/cases.json` and dynamic `/public/cases/**/meta.json` + `index.md`
- Uses import.meta.glob for dynamic case loading with markdown content
- Main components: App.tsx (main layout), CaseCard.tsx, admin.tsx
- Structured folders: `src/components/`, `src/utils/`, `src/types/`

## Code Style
- TypeScript strict mode with `Case` interface for case data structure
- React functional components with hooks (useState, useEffect)
- Import order: React/external libraries → local components/utils → CSS
- Bootstrap CSS classes for styling, camelCase for React props
- ESLint configuration with react-hooks and typescript-eslint
- File naming: PascalCase for components (.tsx), camelCase for utils (.ts)
- Error handling with try/catch and console.error, fallback data patterns
