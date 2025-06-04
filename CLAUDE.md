# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Response Rules

- 답변은 항상 한국어를 최우선으로 사용
- 무게, 거리, 통화 기준도 한국을 기준으로 우선하여 적용
- 모든 답변엔 먼저 코드를 어떻게 수정하면 좋을지에 대한 제안
- 두 번째 질문을 통해 코드를 작성해달라는 요청이 있을 때만 코드를 직접 수정

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run codegen` - Generate GraphQL types from schema at localhost:4000/graphql
- `npm run postbuild` - Generate sitemap (runs automatically after build)

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 13 with Pages Router (not App Router)
- **Styling**: Styled Components with theme support
- **Data Fetching**: Apollo Client with GraphQL
- **TypeScript**: Strict mode enabled with path mapping (`~/*` maps to `src/*`)
- **Responsive Design**: Mobile-first with device detection via user agent

### Key Architecture Patterns

#### Device-Responsive Structure

The app uses a unique dual-container pattern for mobile/desktop layouts:

- `src/container/desktop/` - Desktop-specific containers and components
- `src/container/mobile/` - Mobile-specific containers and components
- `src/views/desktop/` and `src/views/mobile/` - High-level view components
- Device detection happens via `DeviceProvider` context using server-side user agent detection

#### GraphQL Integration

- Schema endpoint: `http://localhost:4000/graphql` (development)
- GraphQL files: `src/gql/*.graphql` contain queries and fragments
- Generated types: `src/graphql/typeGenerated.ts` and `src/graphql/gqlGenerated.ts`
- Apollo Client configured with SSR/SSG support in `src/module/apolloClient.ts`

#### Component Organization

- `src/components/` - Shared UI components
- `src/container/` - Container components split by device type
- `src/views/` - Page-level view components
- `src/context/` - React contexts for state management
- `src/hook/` - Custom React hooks

#### Path Aliases

- Use `~/` prefix for all internal imports (maps to `src/`)
- Example: `import { useDevice } from '~/context/Device.context'`

### Important Conventions

#### File Naming

- Components: `ComponentName.component.tsx`
- Containers: `ContainerName.container.tsx`
- Contexts: `ContextName.context.tsx`
- Hooks: `useHookName.ts`
- Types: `fileName.type.ts`

#### Styling

- Uses Styled Components with theme support
- Global styles in `src/styles/Global.ts`
- Component-specific styles co-located with components
- SVG imports configured via @svgr/webpack

#### GraphQL Code Generation

Run `npm run codegen` after modifying GraphQL queries in `src/gql/` to regenerate TypeScript types. The GraphQL server must be running at localhost:4000.

#### Device Context Usage

Always use the `useDevice()` hook to conditionally render mobile vs desktop components:

```tsx
const { isMobile } = useDevice()
return isMobile ? <MobileComponent /> : <DesktopComponent />
```

#### ESLint Configuration

- TypeScript strict rules enabled
- React hooks rules enforced
- Import/export validation
- Prettier integration for formatting
- Accessibility (jsx-a11y) rules enabled
