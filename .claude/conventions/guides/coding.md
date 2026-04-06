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

- **page.tsx**: 라우트 엔트리, 메타데이터 설정, 데이터 패칭
- **views**: 디바이스별 페이지 레이아웃 조합
- **container**: 상태 관리/로직 처리, desktop/mobile 분리
- **components**: 재사용 가능한 순수 UI 컴포넌트

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
