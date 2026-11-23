# 아키텍처

poke-korea에서 **지금 유효한 구조 결정**만 담는다. 이 문서가 구조 결정의 권위 원본이다.

- 결정이 바뀌면 그 작업 PR에서 이 문서의 해당 절을 현재 상태로 고친다. 지난 상태는 남기지 않는다.
- 검토한 대안·기각 사유·근거 링크는 그 PR 본문의 "검토한 대안" 섹션에 남는다. 어떤 절이 언제 왜 바뀌었는지는 `git log -p -- .claude/decisions/architecture.md`로 찾는다.
- 코드·SPEC·가이드는 결정 내용을 다시 적지 않고 이 문서의 절을 링크한다. 세부 작성 규칙이 가이드에 있으면 이 문서는 그 가이드를 가리키기만 한다.
- 각 절의 "결정 기록"은 결정 당시의 ADR(보관본, [`records/`](records/index.md))이다. 근거를 깊이 볼 때만 읽는다.

---

## 1. 플랫폼

- Next.js 15 라인(App Router) + React 18. 정확한 버전은 `package.json`이 원본이다.
- 서버는 `next start`를 PM2로 self-host한다(`ecosystem.config.js`).
- 16 라인은 React 19를 강제해 Apollo Client 등 React 18 생태계 의존성 전체의 재검증이 필요하다. 16 전환은 React 19 마이그레이션과 함께 하나의 작업으로 검토한다.

결정 기록: [ADR-0004](records/ADR-0004-nextjs-15-migration.md)

## 2. 렌더링과 반응형

- **반응형 단일 컴포넌트.** 하나의 컴포넌트가 CSS로 모든 폭에 대응한다. 모바일/데스크톱 컴포넌트를 2벌로 만들지 않는다.
- **UA 분기는 제거 중이다.** `isMobile ? <Mobile/> : <Desktop/>`, `DeviceProvider`/`useDevice`, `containers/desktop`·`containers/mobile`은 이전 방식의 잔재다. 신규 코드에 쓰지 않고, 남은 곳(헤더·푸터 등)은 라우트·컴포넌트 단위로 점진 전환한다.
- **브레이크포인트는 `mobile`(768px 이하)·`desktop`(769px 이상) 2종뿐이다.** 중간 구간이 필요해 보이면 브레이크포인트를 늘리지 않고 열 수·고정 폭을 바꿔 레이아웃을 먼저 조정한다.
- **root font-size는 16px 고정, 모바일 퍼스트.** 화면별 크기 차이는 rem 자동 축소가 아니라 명시적 반응형 토큰(`text-sm desktop:text-base`)으로 표현한다. 예외는 `text-base` 하나로, CSS 변수로 모바일 14px·데스크톱 16px이다.
- **터치 타겟은 44px 기본**에 탭·칩·데스크톱 입력 컨트롤 예외가 있다(WCAG 2.2 2.5.8).

이유: 디자인 시스템 컴포넌트를 하나로 유지하고, UA 분기가 만드는 client 강등·하이드레이션 비용을 없애며, `1rem`을 모든 화면에서 같은 값으로 두어 토큰을 예측 가능하게 하기 위해서다.

세부 규칙: [`styling.md`](../conventions/guides/styling.md), [`structure.md`](../conventions/guides/structure.md)
결정 기록: [ADR-0007](records/ADR-0007-responsive-rendering-strategy.md), [ADR-0009](records/ADR-0009-root-font-size-fixed.md), [ADR-0011](records/ADR-0011-tab-touch-target-24px.md), [ADR-0012](records/ADR-0012-responsive-base-font-token.md), [ADR-0013](records/ADR-0013-champions-detail-responsive-layout.md), [ADR-0020](records/ADR-0020-breakpoint-two-only.md)

## 3. 데이터 페칭과 캐시

- 데이터는 Apollo Client(GraphQL)로만 가져온다.
- **서버 쿼리 결과를 클라이언트 캐시로 하이드레이트한다.** 각 `page.tsx`가 `extractApolloState`로 캐시를 추출해 그 페이지의 `<Providers initialApolloState>`에 넘기고, 클라이언트는 생성 시점에 `cache.restore()`한다. `useQuery`(cache-first)는 초기 요청을 보내지 않고, 네트워크 요청은 무한 스크롤의 `fetchMore`에서만 생긴다.
- **페이지네이션 병합은 typePolicies가 맡는다.** `keyArgs`·`merge`는 `PAGINATED_QUERY_FIELDS`(`modules/apolloClient.module.ts`)에서 생성한다. 훅·Context에서 `updateQuery`로 직접 병합하지 않는다.
- 캐시 정책(ISR·Cache-Control)은 [`nextjs.md`](../conventions/guides/nextjs.md)가 원본이다.

결정 기록: [ADR-0014](records/ADR-0014-apollo-ssr-cache-hydration.md)

## 4. 링크와 prefetch

- 모든 내부 링크는 `IntentLink`(`components/link/IntentLink.component.tsx`)로 만든다. `prefetch={false}`로 두고 터치 시작·마우스 올림·키보드 포커스 때 `router.prefetch`를 호출한다.
- `next/link` 직접 import는 ESLint `no-restricted-imports`가 막는다(`IntentLink` 파일만 예외).

이유: 화면에 보이는 링크를 모두 미리 받으면 누르지 않을 페이지까지 요청·전송량이 생긴다. 누르려는 의도가 보일 때만 받는다.

세부 규칙: [`coding.md`](../conventions/guides/coding.md) "링크"
결정 기록: [ADR-0025](records/ADR-0025-layout-link-prefetch-off.md)

## 5. 검색 입력과 URL 상태

- URL 쿼리에 검색어를 쓰는 검색창(도감·기술·특성 목록)은 `useSearchParamInput`을 쓴다. 디바운스 후 `router.replace`로 동기화하고, 입력은 제어 컴포넌트이며, 사용자가 그사이 입력하지 않았을 때만 바뀐 URL 검색어를 따라간다.
- 디바운스된 값을 state로 쓰는 곳(헤더 검색, 상성 계산기 이름 입력)은 `useDebounce`를 쓴다.
- react-hook-form을 쓰지 않는다. 필터 모달처럼 제출 시점에만 값이 필요한 폼은 비제어 input + 제출 시 `FormData`로 읽는다.

이유: `push`는 검색마다 방문 기록을 쌓는다. 디바운스를 effect cleanup으로 처리하면 ref·`useCallback` 없이 의존성을 모두 채운 effect로 쓸 수 있다.

세부 규칙: [`coding.md`](../conventions/guides/coding.md)
결정 기록: [ADR-0023](records/ADR-0023-search-input-url-sync.md)

## 6. 컴포넌트 단위 상태 보존

- 가로 스크롤 버전 nav(`MovesVersionNav`)는 스크롤 위치를 `sessionStorage`에 `storageKey`별로 저장하고, 마운트 시 복원 → 활성 칩이 시야 밖일 때만 보정한다. 복원은 `useLayoutEffect`(isomorphic)로 하고, 보정 애니메이션은 `prefers-reduced-motion`을 따른다.

결정 기록: [ADR-0015](records/ADR-0015-moves-version-nav-scroll-restore.md)

## 7. 디자인 시스템

- 디자인 시스템 도구는 Storybook이다. 실제 컴포넌트를 그대로 렌더하는 story로 등록하고, 손으로 재현하거나 스크린샷을 쓰지 않는다.
- 구축 순서는 원자(atom) → 조립(molecule·organism) → 페이지다.

결정 기록: [ADR-0008](records/ADR-0008-storybook-design-system.md), [ADR-0010](records/ADR-0010-atomic-first-ds-build-order.md)

## 8. 코드 구조와 작성 규칙

이 문서에 다시 적지 않는다. 각 가이드가 원본이다.

| 주제                                       | 원본                                                                                             | 결정 기록                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| 폴더 배치 (사용 도메인 수로 결정)          | [`structure.md`](../conventions/guides/structure.md)                                             | [ADR-0016](records/ADR-0016-folder-structure-by-domain-usage.md) |
| 이름 (접미사 체계, 핸들러 이름)            | [`naming.md`](../conventions/guides/naming.md)                                                   | [ADR-0017](records/ADR-0017-naming-conventions.md)        |
| 작성 (엄격 타입, Context, 핸들러, 경계)    | [`coding.md`](../conventions/guides/coding.md)                                                   | [ADR-0018](records/ADR-0018-strict-code-conventions.md)   |
| 린트·포맷 (역할 분리, import 계층 정렬)    | [`linting.md`](../conventions/guides/linting.md), [`formatting.md`](../conventions/guides/formatting.md) | [ADR-0019](records/ADR-0019-lint-format-separation.md)    |

## 9. 테스트

- 단위 테스트 도구를 두지 않는다. 자동 테스트는 Playwright E2E만이며, spec은 `/e2e-check`가 검사마다 작성하고 지운다.
- 순수 계산 로직은 구현할 때 기대값과 한 번 대조하고, 대조한 케이스는 changelog 검증 절에 남긴다.
- 상시 보호가 필요한 순수 로직이 여럿 생기면 단위 테스트 도입을 다시 검토한다. 그때는 Vitest가 우선 후보다.

세부 규칙: [`testing.md`](../conventions/guides/testing.md)
결정 기록: [ADR-0024](records/ADR-0024-no-unit-test-framework.md)

## 10. SEO 인프라와 크롤러

- 메타데이터·JSON-LD·sitemap/robots 구조는 [`seo-audit` 스킬](../skills/seo-audit/SKILL.md)의 "이 프로젝트의 SEO 구조"가 원본이다.
- **SEO와 무관한 크롤러는 robots.txt와 CloudFront Function 두 곳에서 막는다.** robots.txt를 지키지 않는 크롤러까지 엣지에서 차단하기 위해서다. 판정은 UA 기준이고, IP 차단은 UA를 위장하는 크롤러에만 쓴다. 차단 목록의 원본은 `src/app/robots.ts`다.
- 검색·광고·링크 미리보기 크롤러(Googlebot, bingbot, Yeti, Daum, 애드센스, SNS 미리보기)와 AI 검색 크롤러는 허용한다.

결정 기록: [ADR-0026](records/ADR-0026-bot-blocking-at-edge.md)

## 11. 홈 화면 아이콘

- 아이콘 이미지는 `public/assets/icons/`에 둔다. iOS는 루트 레이아웃 `metadata.icons.apple`, Android는 `src/app/manifest.ts`로 연결한다.
- 매니페스트 `display`는 `'browser'`다. 앱 모드(주소창 숨김)로 띄우지 않는다.

결정 기록: [ADR-0021](records/ADR-0021-home-screen-app-icon.md)

## 12. 작업 체계

- 하네스(`.claude/`) 구조는 [`structure.md`](../conventions/guides/structure.md) "`.claude/` 구조"가, 브랜치·버전·다중 Phase 체이닝은 [`workflow.md`](../conventions/guides/workflow.md)가 원본이다.

결정 기록: [ADR-0001](records/ADR-0001-harness-engineering.md), [ADR-0002](records/ADR-0002-feature-roadmap-branching.md)

---

## 미결 결정

| 주제                                              | 상태                                                                                       | 기록                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 도감 목록 이름 검색에 리전폼·메가진화 폼 단위 포함 | 제안 — 백엔드 검토 대기. 확정되면 5절에 반영한다 | [ADR-0022](records/ADR-0022-list-search-include-forms.md) |

## 더 이상 유효하지 않은 결정

| 기록                                                       | 내용                                   | 대체        |
| ---------------------------------------------------------- | -------------------------------------- | ----------- |
| [ADR-0003](records/ADR-0003-champions-detail-layout.md)    | 챔피언스 상세 sticky 2단 레이아웃      | 2절 (ADR-0013) |
| [ADR-0005](records/ADR-0005-traffic-growth-kpi-2026-09.md) | 단기 트래픽 KPI — 근거 보고서 오류로 폐기 | 없음        |
| [ADR-0006](records/ADR-0006-adaptive-rendering-strategy.md) | 적응형(UA 분기) 렌더링 일원화          | 2절 (ADR-0007) |
