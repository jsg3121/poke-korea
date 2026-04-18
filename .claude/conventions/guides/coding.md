# 코딩 컨벤션

## 파일 네이밍

| 유형 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | `이름.component.tsx` | `Tag.component.tsx` |
| 컨테이너 | `이름.container.tsx` | `List.container.tsx` |
| 컨텍스트 | `이름.context.tsx` | `Device.context.tsx` |
| 커스텀 훅 | `use이름.ts` | `useDebounce.ts` |
| 타입 정의 | `이름.type.ts` 또는 `이름.types.ts` | `detailContext.type.ts` |
| 모듈 | `이름.module.ts` | `metadata.module.ts` |
| 뷰 (데스크톱) | `이름.desktop.tsx` | `Home.desktop.tsx` |
| 뷰 (모바일) | `이름.mobile.tsx` | `Home.mobile.tsx` |

## 경로 별칭

`~/` 접두어로 모든 내부 모듈 import (`tsconfig.json`에서 `src/*`에 매핑)

```tsx
import { useDevice } from '~/context/Device.context'
```

## 컴포넌트 계층 구조

```text
page.tsx (라우트) → views (페이지 뷰) → container (비즈니스 로직) → components (UI)
```

- **page.tsx**: 라우트 엔트리, 메타데이터 설정, 서버 데이터 패칭
- **views**: 디바이스별 페이지 레이아웃 조합. Container만 호출하며, 직접 components를 호출하지 않음
- **container**: 상태 관리/로직 처리, desktop/mobile 분리. 비즈니스 로직(데이터 변환, 포맷팅 등) 포함
- **components**: 재사용 가능한 순수 UI 컴포넌트. Props만 받아서 렌더링

### 계층별 책임 상세

| 계층 | 허용 | 금지 |
|------|------|------|
| page.tsx | 서버 데이터 패칭, 메타데이터, JSON-LD, views 분기 | 비즈니스 로직, UI 렌더링 |
| views | Container 호출, 광고/푸터 등 레이아웃 컴포넌트 배치 | components 직접 호출, 비즈니스 로직 |
| container | 비즈니스 로직, 상태 관리, components 호출 | 서버 데이터 패칭 |
| components | Props 기반 순수 UI 렌더링 | 비즈니스 로직, 상태 관리 |

**Why:** 계층을 명확히 분리하면 테스트 용이성, 재사용성, 유지보수성이 향상됨. views에서 components를 직접 호출하면 비즈니스 로직이 views로 누출되어 계층 구조가 무너짐.

## 디바이스 반응형 구조

모바일/데스크톱 레이아웃을 이중 컨테이너 패턴으로 분리합니다:

- `src/container/desktop/` — 데스크톱 전용 컨테이너
- `src/container/mobile/` — 모바일 전용 컨테이너
- `src/views/desktop/` / `src/views/mobile/` — 디바이스별 페이지 뷰
- `DeviceProvider` 컨텍스트에서 서버 사이드 User Agent 기반 기기 감지

```tsx
const { isMobile } = useDevice()
return isMobile ? <MobileComponent /> : <DesktopComponent />
```

**Why:** SSR 시점에서 User Agent로 기기를 판별하여 불필요한 컴포넌트 로딩을 방지하고, 각 디바이스에 최적화된 레이아웃을 제공하기 위함.

**How to apply:** 새로운 페이지/컨테이너 추가 시 반드시 desktop/mobile 분리 구조를 따를 것. 공용 UI 컴포넌트는 `src/components/`에 배치.
