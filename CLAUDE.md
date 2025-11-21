# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Response Rules

- 답변은 항상 한국어를 최우선으로 사용
- 무게, 거리, 통화 기준도 한국을 기준으로 우선하여 적용
- 모든 답변엔 먼저 코드를 어떻게 수정하면 좋을지에 대한 제안
- 두 번째 질문을 통해 코드를 작성해달라는 요청이 있을 때만 코드를 직접 수정
- 코드 작성시엔 프로젝트 폴더 내에 있는 lintrc, prettierrc에 맞춰서 작성해줘
- 코드를 작성할 때 해당 기능이 동작될 수 있는 최소한의 구현을 실행
- 모든 코드에 대해선 반드시 이슈가 발생할 가능성이 있는지 테스트를 진행하고, 어떤 부분을 개선해야할 지는 답변으로만 명시

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run codegen` - Generate GraphQL types from schema at localhost:4000/graphql
- `npm run postbuild` - Generate sitemap (runs automatically after build)

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with utility-first approach
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

- Uses Tailwind CSS with utility-first approach
- Global styles in `src/styles/globals.css` and `src/styles/common.css`
- Component styles using Tailwind utility classes
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

## Version Control & Release Management

### Branch Strategy

#### Branch Naming Convention

```text
feature/{version}
예: feature/1.25.0, feature/1.26.0
```

- 모든 새로운 작업은 `feature/{version}` 형식의 브랜치에서 진행
- 버전 번호는 [Semantic Versioning](https://semver.org/lang/ko/) 준수
  - **Major (X.0.0)**: 대규모 변경, Breaking Changes
  - **Minor (1.X.0)**: 새로운 기능 추가, 하위 호환성 유지
  - **Patch (1.26.X)**: 버그 수정, 소규모 개선
- 브랜치는 사용자가 직접 생성하므로, 새로운 작업 시작 시 브랜치 생성 여부 확인 필요

#### Workflow

1. 사용자가 main에서 `feature/{version}` 브랜치 생성
2. 해당 브랜치에서 작업 진행
3. 작업 완료 후 PR 생성
4. main 브랜치로 머지

### Update Log Management

#### 로그 파일 위치

```text
updateLog/{version}.md
예: updateLog/1.25.0.md
```

#### 로그 작성 시점

1. **브랜치 작업 시작 시**: 새 버전 로그 파일 생성
2. **주요 기능 추가/수정 시**: 실시간으로 로그 업데이트
3. **main 머지 전**: 최종 검토 및 완성
4. **main 머지 후**: 릴리즈 날짜, PR 링크 추가

#### 로그 필수 섹션

- 📋 목차
- 🎯 주요 변경사항
- ✨ 기능 개선
- 🐛 버그 수정
- 📝 커밋 히스토리

#### 로그 선택 섹션 (해당 시)

- 🔍 SEO 개선
- 🔧 코드 리팩토링
- 🚀 성능 개선
- 🎨 디자인 변경
- 🔨 기술적 개선사항

#### 로그 작성 가이드라인

1. **명확한 제목**: 각 섹션의 제목은 명확하고 구체적으로
2. **코드 예시**: 변경사항은 Before/After 코드로 설명
3. **파일 링크**: 변경된 파일은 상대 경로로 링크 (`[파일명](../src/...)`))
4. **통계 제공**: 정량적 지표 포함 (줄 수, 파일 수, 개선율 등)
5. **이모지 활용**: 가독성을 위해 적절한 이모지 사용

#### 권장 이모지

- 🎯 주요 변경사항
- ✨ 새 기능
- 🐛 버그 수정
- 🔧 리팩토링
- 🔍 SEO
- 📊 통계
- 🚀 성능 개선
- 🎨 디자인
- 📝 문서

### 새 작업 시작 시 체크리스트

Claude가 새로운 작업 요청을 받았을 때:

1. **브랜치 확인**: 현재 작업 중인 브랜치가 feature/{version} 형식인지 확인
2. **브랜치 생성 필요 시**: 사용자에게 새 브랜치 생성 여부 확인

   ```text
   "이 작업을 위한 새 feature 브랜치를 생성하시겠습니까?
   예: feature/1.27.0"
   ```

3. **업데이트 로그 확인**: 해당 버전의 업데이트 로그 파일이 존재하는지 확인
4. **로그 업데이트**: 작업 완료 시 업데이트 로그에 변경사항 자동 기록

### 업데이트 로그 자동화

주요 작업(기능 추가, 리팩토링, 버그 수정 등) 완료 시:

1. 현재 브랜치에서 버전 번호 추출
2. `updateLog/{version}.md` 파일 읽기
3. 해당 섹션에 변경사항 추가
4. 통계 업데이트 (파일 수, 코드 라인 변화 등)

### 참고 문서

- 상세한 업데이트 로그 가이드: [updateLog/README.md](updateLog/README.md)
- 업데이트 로그 템플릿: [updateLog/1.26.0.md](updateLog/1.26.0.md) 참고
