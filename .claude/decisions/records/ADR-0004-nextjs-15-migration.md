# ADR-0004: Next.js 14 → 15 메이저 업그레이드 (보안 패치 대응)

- **상태**: 제안
- **날짜**: 2026-05-09
- **담당**: Claude + 사용자

## 맥락

본 프로젝트는 현재 **Next.js 14.2.35**, **React 18.3.1**을 사용 중이다. 2025년 12월~2026년 5월 사이 React Server Components(RSC)와 Next.js 본체에 다수의 보안 취약점이 공개되었으며, `npm audit` 결과 본 프로젝트는 다음 5개의 Next.js 본체 high-severity 취약점에 노출되어 있다.

| GHSA | 종류 | 본 프로젝트 영향 |
| --- | --- | --- |
| GHSA-9g9p-9gw9-jx7f | Image Optimizer DoS | self-host(`next start` + PM2) 운영으로 직접 영향 |
| GHSA-h25m-26qc-wcjf | RSC HTTP request 역직렬화 DoS | App Router 사용으로 영향 범위 |
| GHSA-ggv3-7p47-pfv8 | rewrites HTTP request smuggling | `next.config.js` rewrites 설정 시 영향 |
| GHSA-3x4c-7xq6-9pq8 | next/image 디스크 캐시 무제한 증가 | self-host 환경 영향 |
| GHSA-q4gf-8mx6-v5v3 | Server Components DoS | App Router 사용으로 영향 범위 |

추가로 2026-04~05 공개된 CVE-2026-23864/23869/23870(RSC DoS), CVE-2026-44578(SSRF, Critical) 등도 14.x 라인을 영향 범위에 포함시킨다.

핵심 제약: **Next.js 14.x 라인은 14.2.35가 마지막 릴리스로 EOL 상태**이며, 위 취약점들에 대한 14.x 패치는 발표되지 않을 예정이다. `npm audit`이 권장하는 유일한 해결 경로 또한 메이저 업그레이드(`next@16.2.6` 또는 `next@15.x`)이다.

영향 범위 사전 조사 결과, 본 프로젝트는 이미 Next.js 15 호환 비동기 패턴을 사용하고 있어 코드 마이그레이션 부담이 거의 없다는 점이 확인되었다.

## 결정

**Next.js 14.2.35 → 15.5.18 메이저 업그레이드를 채택한다.** React 18.3.1은 그대로 유지한다.

업그레이드 대상 패키지는 다음 3개로 제한한다.

| 패키지 | 현재 → 목표 |
| --- | --- |
| `next` | 14.2.35 → 15.5.18 |
| `eslint-config-next` | 14.2.15 → 15.5.18 |
| `@next/eslint-plugin-next` | 14.2.15 → 15.5.18 |

`react`, `react-dom`, `@apollo/client`, `react-hook-form`, `chart.js`, `react-chartjs-2`, `graphql`, `immer`, `@svgr/webpack`, `tailwindcss`, `typescript` 등 다른 의존성은 변경하지 않는다.

dev 의존성에 대한 `npm audit fix`(breaking change 없음)는 본 ADR과 별도 작업으로 분리하여 진행한다.

## 근거

### 1. EOL 라인에 머무를 수 없음

[npm dist-tags](https://registry.npmjs.org/next)에 `next-14: 14.2.35`로 고정되어 있고 새 패치가 발표되지 않는다. 14.x 라인은 [Next.js 공식 보안 공지](https://nextjs.org/blog/security-update-2025-12-11)에서도 14.2.35를 끝으로 추가 패치 라인이 명시되지 않았다. EOL 라인에 머물면 신규 CVE가 공개될 때마다 보안 부채가 누적된다.

### 2. 15.x를 선택한 이유 (16.x 대비)

| 항목 | 15.5.18 | 16.2.6 |
| --- | --- | --- |
| React 버전 요구 | React 18 호환 | **React 19 강제** |
| 본 프로젝트 의존성 영향 | 없음 (React 18 유지) | `@apollo/client`, `react-hook-form`, `@types/react` 호환성 재검증 필요 |
| 보안 패치 반영도 | 2026-05 시점 모든 CVE 패치 포함 | 동일 |
| 마이그레이션 단계 | 1단계(14→15) | 2단계 점프(14→16) |

본 프로젝트는 [package.json](../../../package.json)의 `react@18.3.1`을 중심으로 13개 의존성이 React 18 생태계에 묶여 있다. 16.x 직행은 React 19로의 동시 마이그레이션을 강제하여 호환성 검증 부담이 큰 반면, 보안 부채 해소라는 1차 목표에 추가 가치를 거의 주지 않는다.

[Next.js 공식 업그레이드 가이드](https://nextjs.org/docs/app/guides/upgrading/version-15)에 따르면 15.x는 React 18을 정식 지원하며, 비동기 Request API 등 주요 breaking change가 14에서 단계적으로 마이그레이션 가능하도록 설계되어 있다.

### 3. 코드 마이그레이션 부담이 0에 가까움

영향 범위 조사 결과 본 프로젝트는 이미 Next.js 15 비동기 패턴을 적용한 상태이다.

- 동적 라우트 12개 폴더 — `params: Promise<{...}>` 타입으로 이미 선언 (예: [src/app/moves/[id]/page.tsx:17-19](../../../src/app/moves/%5Bid%5D/page.tsx))
- 30개 파일 `await headers()` 패턴 사용 (예: [src/app/page.tsx](../../../src/app/page.tsx))
- `cookies()`, `draftMode()` 사용 0건
- `fetch()` 직접 호출 0건 (모든 데이터 페칭은 Apollo Client 사용)

즉 14에서는 불필요했던 `await` 패턴이 이미 적용되어 있어 15로 올라가면 자연스럽게 적합해진다.

### 4. 보안 부채의 즉각적 해소

업그레이드만으로 `npm audit`이 보고한 5개 Next.js 본체 high-severity 취약점이 모두 해소된다. self-host(`next start` + PM2 [package.json:27](../../../package.json#L27)) 환경의 SSRF/Image DoS 위험을 코드 변경 없이 차단할 수 있는 유일한 방법이다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| --- | --- | --- | --- |
| 14.x 유지 + WAF/리버스 프록시 방어 | 코드 변경 없음, 즉시 적용 | Image Optimizer DoS, Server Components DoS는 인프라 단에서 차단 어려움. 보안 부채 영구 누적. 14.x EOL로 향후 CVE는 더 늘어날 전망 | 근본 해결 불가 |
| Next.js 16.2.6으로 직접 업그레이드 | 1회 작업으로 종결, 최신 기능 사용 가능 | React 19 강제 → Apollo Client/RHF/Chart.js 등 13개 의존성 호환성 재검증 필요. 디버깅 난이도 상승 | 보안 1차 목표 대비 비용 과다 |
| Next.js 15.x + React 19 동시 업그레이드 | 향후 React 19 도입 부담 감소 | React 19는 2026-05 시점 본 프로젝트 의존성과의 호환성 미검증. 두 메이저 변경 동시 진행 시 디버깅 난이도 상승 | 1차 보안 목표와 무관한 변경 묶음 |

## 결과

### 예상 변화

1. `npm audit` Next.js 본체 high-severity 취약점 5건 모두 해소
2. 2026-04~05 공개된 RSC DoS / SSRF / 미들웨어 우회 CVE 영향에서 벗어남
3. 향후 Next.js 보안 패치를 정상적으로 받을 수 있는 라인(15.5.x backport 라인)에 진입
4. 코드 변경은 사실상 없음 (이미 비동기 패턴 적용 상태)

### 구현 영향

- [package.json](../../../package.json) — `next`, `eslint-config-next`, `@next/eslint-plugin-next` 버전 수정
- `package-lock.json` 재생성
- [next.config.js](../../../next.config.js) — Next.js 15에서 deprecated된 옵션 사용 여부 사전 확인 결과: **변경 불필요**. `experimental: {}`, `compiler.removeConsole`, `redirects()`, `headers()`, `webpack()` 등 모든 옵션이 15.x 호환
- `next/image`, `next/font`, `cookies()`, `draftMode()`, middleware, Route Handler 모두 본 프로젝트에서 사용하지 않아 영향 없음 (사전 점검 완료)

### Follow-up (별도 작업 권장, 본 마이그레이션 범위 외)

[next.config.js:363-386](../../../next.config.js)의 `webpack()` 함수 내 `pages/_app` 타겟 entry 조작 코드는 App Router 빌드에서 매칭되지 않아 무동작 상태이다(빌드 매니페스트의 `pages: { "/_app": [] }` 확인). `globals.css` 프리로드(`<link rel="preload">`) 구현이 필요하면 별도 ADR/작업으로 분리하여 RootLayout 또는 Metadata API를 통해 정공법으로 구현한다. 본 마이그레이션 범위에서는 작동·미작동 어느 쪽이든 동작 변화가 없으므로 그대로 유지한다.

### 검증 항목

업그레이드 후 다음 항목을 검증한다.

1. `npm run lint` 통과 (ESLint 룰 변경 영향 확인)
2. `npm run build` 통과
3. `npm run dev` 정상 기동 후 주요 페이지 수동 점검
   - 홈 ([src/app/page.tsx](../../../src/app/page.tsx))
   - 포켓몬 상세 (`src/app/detail/[pokemonId]/`)
   - 기술 상세 (`src/app/moves/[id]/`)
   - 특성 상세 (`src/app/ability/[id]/`)
   - 챔피언스 상세 (`src/app/champions/list/[pokemonId]/`)
4. ISR 동작 확인 — `revalidate` 설정이 적용된 페이지의 정적 캐싱 작동 여부
5. Apollo Client SSR 통합 — `initializeApollo`(`src/module/apolloClient`) 정상 동작 여부
6. `next/image` 렌더링 결과 시각 비교 (있을 경우)

### 롤백 전략

`feature/1.41.0-nextjs-15-upgrade` 브랜치에서만 작업하며, 검증 실패 시 이 브랜치를 폐기하고 `feature/1.41.0` 루트는 손대지 않는다. 머지 후 문제 발견 시 `git revert` 또는 `package.json`/`package-lock.json` 한 쌍을 14.2.35로 되돌리는 단일 커밋으로 롤백 가능하다.

## 참고 자료

- [Next.js 15 업그레이드 가이드](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 15 릴리스 노트](https://nextjs.org/blog/next-15)
- [Next.js Security Update: December 11, 2025](https://nextjs.org/blog/security-update-2025-12-11)
- [Security Advisory: CVE-2025-66478 (React2Shell)](https://nextjs.org/blog/CVE-2025-66478)
- [Vercel: Summary of CVE-2026-23864](https://vercel.com/changelog/summary-of-cve-2026-23864)
- [Cloudflare: WAF mitigations for React/Next.js vulnerabilities](https://developers.cloudflare.com/changelog/post/2026-05-06-react-nextjs-vulnerabilities/)
- [GitHub Advisory Database — next 패키지](https://github.com/advisories?query=type%3Areviewed+ecosystem%3Anpm+next)
- [npm registry: next dist-tags](https://registry.npmjs.org/next) — `next-14: 14.2.35` (EOL), `backport: 15.5.18` (15.x 보안 백포트 최신)
