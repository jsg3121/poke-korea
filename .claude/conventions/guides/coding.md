# 코딩 컨벤션

## 파일 네이밍

| 유형          | 패턴                                | 예시                    |
| ------------- | ----------------------------------- | ----------------------- |
| 컴포넌트      | `이름.component.tsx`                | `Tag.component.tsx`     |
| 컨테이너      | `이름.container.tsx`                | `List.container.tsx`    |
| 컨텍스트      | `이름.context.tsx`                  | `Device.context.tsx`    |
| 커스텀 훅     | `use이름.ts`                        | `useDebounce.ts`        |
| 타입 정의     | `이름.type.ts` 또는 `이름.types.ts` | `detailContext.type.ts` |
| 모듈          | `이름.module.ts`                    | `metadata.module.ts`    |
| 뷰 (데스크톱) | `이름.desktop.tsx`                  | `Home.desktop.tsx`      |
| 뷰 (모바일)   | `이름.mobile.tsx`                   | `Home.mobile.tsx`       |

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

| 계층       | 허용                                                | 금지                                |
| ---------- | --------------------------------------------------- | ----------------------------------- |
| page.tsx   | 서버 데이터 패칭, 메타데이터, JSON-LD, views 분기   | 비즈니스 로직, UI 렌더링            |
| views      | Container 호출, 광고/푸터 등 레이아웃 컴포넌트 배치 | components 직접 호출, 비즈니스 로직 |
| container  | 비즈니스 로직, 상태 관리, components 호출           | 서버 데이터 패칭                    |
| components | Props 기반 순수 UI 렌더링                           | 비즈니스 로직, 상태 관리            |

**Why:** 계층을 명확히 분리하면 테스트 용이성, 재사용성, 유지보수성이 향상됨. views에서 components를 직접 호출하면 비즈니스 로직이 views로 누출되어 계층 구조가 무너짐.

## App Router 프라이빗 폴더 (`_fetch` / `_metadata`)

`src/app/` 하위에서 페이지가 아닌 파일은 `_` 접두 폴더로 분리합니다.

| 폴더         | 역할                                              |
| ------------ | ------------------------------------------------- |
| `_fetch/`    | 서버 데이터 패칭 함수. 라우트가 여러 개일 때 공유 |
| `_metadata/` | `generateMetadata`용 메타데이터 생성 함수         |

### 분리 기준 — "공유되면 분리"

**모든 패칭을 `_fetch`로 옮기지 않습니다.** 실제 기준은 재사용 여부입니다.

| 상황                              | 방식                |
| --------------------------------- | ------------------- |
| 쿼리 1개 + 라우트 1개             | `page.tsx`에 인라인 |
| 쿼리 여러 개를 여러 라우트가 공유 | `_fetch/`로 분리    |

`/list`·`/ability`·`/moves` 목록 페이지가 인라인인 것은 쿼리도 라우트도 하나뿐이라 분리해도 파일만 늘기 때문입니다. 반대로 `/detail/[pokemonId]/moves`는 하위 라우트 6개가 같은 데이터를 쓰므로, 인라인으로 두면 동일 패칭 블록이 6번 복제됩니다.

> **Why:** 실제로 이 복제가 발생한 사례가 있다. `_fetch`로 쿼리는 분리했으나 응답 후처리(`getPokemonLearnableData()`)는 각 `page.tsx`에 남겨, **같은 함수가 5개 파일에 복붙**된 상태가 유지됐다(1.56.0 습득 기술 통합에서 제거). 패칭을 분리할 때는 **응답 가공까지 함께** 옮겨야 목적을 달성한다.

### `_` 접두사의 의미

Next.js의 [Private Folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders) 규약입니다. `_`로 시작하는 폴더와 그 하위는 라우팅에서 제외됩니다.

다만 App Router는 `page.tsx`가 있는 폴더만 라우트로 만들므로, **`_`가 없어도 라우트가 생기지는 않습니다.** 접두사의 실질적 가치는 두 가지입니다.

- **의도 명시**: "이 폴더는 라우트 세그먼트가 아니다"를 이름으로 선언해, 나중에 `page.tsx`를 넣는 실수를 막는다
- **탐색성**: 에디터 파일 트리에서 라우트 폴더와 시각적으로 분리된다

**How to apply:** 새 라우트 그룹을 만들 때, 하위 라우트가 2개 이상이고 데이터를 공유한다면 `_fetch/`를 먼저 만든다. 단일 라우트라면 `page.tsx`에 인라인으로 두고, 라우트가 늘어나는 시점에 분리한다.

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
