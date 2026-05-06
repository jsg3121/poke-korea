# ADR-0004: 사이트 전체 브라우저 자동 스크롤 복원 비활성화

- **상태**: 승인
- **날짜**: 2026-05-06
- **담당**: Claude + 사용자

## 맥락

`/type-effectiveness` 페이지에 단계 C-2 작업으로 결과 영역 하단 CTA 카드(챔피언스 도감, 퀴즈 등으로 이동)를 추가한 후, 사용자 피드백으로 다음 시나리오의 UX 문제가 보고되었다.

```text
1. /type-effectiveness 진입 → 결과 하단까지 스크롤
2. CTA 카드 클릭 → /champions/list 등 다른 페이지로 이동
3. 그 페이지에서도 스크롤
4. 브라우저 뒤로가기 → /type-effectiveness 복귀
   기대: 페이지 최상단부터 시작
   현재: 어중간한 중간 위치에서 노출됨
```

원인 분석 과정에서 사이트의 핵심 카드/도감 페이지가 모두 무한 스크롤 방식이라는 사실이 확인되었다.

```text
useInfiniteScroll 사용 페이지:
- /list (포켓몬 도감)
- /moves (기술 도감)
- /ability (특성 도감)
- /ability/[id] (특성별 포켓몬)
- /champions/list (챔피언스 도감)
```

브라우저의 기본값(`history.scrollRestoration = 'auto'`)은 페이지가 마운트되며 그려진 DOM 높이까지만 이전 위치를 복원할 수 있다. 무한스크롤로 누적 로드된 카드들은 페이지 재진입 시 다시 첫 페이지부터 로드되므로, 사용자가 보던 깊은 위치(예: 4000px)는 재현되지 않는다. 결과적으로 카드/도감 페이지에서도 스크롤 복원은 사실상 작동하지 않고 있었다.

## 결정

**`history.scrollRestoration = 'manual'` 값을 사이트 전체에 적용하여 브라우저의 자동 스크롤 복원을 비활성화한다.**

```ts
// src/app/layout.tsx 의 <head>에 inline script 1줄로 적용
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
```

이 설정으로 모든 페이지는 진입(또는 뒤로가기)할 때 항상 최상단(0,0)에서 그려진다. 페이지별로 다르게 동작하지 않고 단일 정책으로 통일한다.

`/type-effectiveness`에 한정해 적용하려고 만들었던 `ScrollRestorationManual` 컴포넌트는 폐기한다. 부분 적용은 다음 페이지에 영향을 주지 못해 사용자가 보고한 시나리오를 해결할 수 없었다.

## 근거

### 1. 무한스크롤 페이지에서는 자동 복원이 이미 작동하지 않는다

브라우저의 자동 복원은 DOM 높이가 충분할 때만 정상 동작한다. 카드/도감 페이지 5종(`/list`, `/moves`, `/ability`, `/ability/[id]`, `/champions/list`) 전부 무한스크롤이고 페이지 재진입 시 첫 페이지만 로드되므로, 사용자가 깊은 위치에서 뒤로가기하면 어중간한 위치에 멈춘다.

따라서 "사이트 전체 manual 적용 시 카드 페이지의 스크롤 복원이 사라진다"는 우려는 **현실에 존재하지 않는다**. 이미 작동하지 않는 동작을 보존하려는 것은 의미가 없다.

### 2. 어중간한 위치보다 명확한 최상단이 더 나은 UX

| 페이지 유형                    | auto (현재)             | manual (변경 후)   |
| ------------------------------ | ----------------------- | ------------------ |
| 무한스크롤 카드 페이지         | 어중간한 위치 (불명확) | 최상단 (명확)      |
| 동적 결과 페이지 (`/type-effectiveness`) | 어중간한 위치 (사용자 신고) | 최상단 (사용자 의도) |
| 짧은 정적 페이지 (홈, 퀴즈)    | 정상 복원 / 거의 영향 없음 | 최상단 / 거의 영향 없음 |

세 가지 카테고리 모두 manual 적용이 동등하거나 더 나은 결과를 만든다.

### 3. 단일 정책으로 일관성 확보

페이지별로 다른 스크롤 정책이 적용되면 사용자는 "어떤 페이지는 보던 위치로 복원되고, 어떤 페이지는 최상단으로 가는" 비일관적 동작을 학습해야 한다. 사이트 전체에 동일 정책을 적용하면 학습 비용 없이 동일한 멘탈 모델로 사용 가능하다.

### 4. 구현 단순성과 유지보수 비용

- inline script 1줄로 사이트 전체 적용 가능
- 향후 페이지를 추가해도 별도 처리 불필요
- React hook 사용 없이 처리되어 렌더링 깜빡임 없음

### 5. 무한스크롤 페이지의 진짜 스크롤 복원 구현은 별도 큰 작업

진짜 의미 있는 스크롤 복원(이전 카드 위치 정확히 복원)을 구현하려면 다음이 필요하다:

- 페이지 이탈 시 누적 데이터/스크롤 위치 캐싱
- 재진입 시 캐시 복원 + 점진적 페치 재개
- 캐시 무효화 정책 결정

이는 별도 ADR과 구현이 필요한 큰 작업이며, 본 결정은 이를 막지 않는다 (manual 설정은 향후 더 나은 복원 방식으로 대체될 수 있다).

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| --- | --- | --- | --- |
| 그대로 두기 (auto 유지) | 변경 없음 | `/type-effectiveness` 사용자 시나리오 미해결, 카드 페이지의 어중간한 위치 문제 지속 | 사용자가 명시적으로 보고한 UX 문제 미해결 |
| 특정 페이지만 manual (`ScrollRestorationManual` 컴포넌트) | 다른 페이지 영향 없음 | `/type-effectiveness` 떠난 후 다른 페이지에서 스크롤한 뒤 뒤로가기 시 효과 없음 | 사용자 시나리오 (CTA 이동 → 다른 페이지 스크롤 → 뒤로가기)를 해결하려면 "다음 페이지"에도 manual이 적용되어야 함 |
| CTA 클릭 시점에만 manual 토글 | 다른 페이지의 정상 동작 유지 | 구현 복잡 (Link onClick 핸들러), CTA 외 경로 이동 시 처리 안 됨 | 어차피 카드 페이지는 무한스크롤로 복원이 정상 작동 안 함 → "다른 페이지의 정상 동작 유지" 전제가 사실과 다름 |
| 무한스크롤 페이지의 진짜 스크롤 복원 구현 | 가장 좋은 UX (이전 위치 정확히 복원) | 구현 매우 복잡, 모든 도감 페이지에 별도 작업 필요 | 별도 큰 작업이며 본 결정과 양립 가능. 추후 별도 ADR로 진행 가능 |

## 결과

### 예상 변화

1. **모든 페이지에서 뒤로가기/새 진입 시 최상단(0,0)부터 그려짐** — 일관된 시작점
2. **`/type-effectiveness` CTA 시나리오 해결** — 다른 페이지에서 스크롤한 뒤 뒤로가기해도 결과 페이지가 최상단부터 시작
3. **카드/도감 페이지에서 어중간한 위치 문제 해소** — 무한스크롤로 인해 어차피 정상 복원 안 되던 동작이 명확한 최상단으로 통일됨
4. **렌더링 깜빡임 없음** — inline script가 React 마운트보다 먼저 실행되므로 useEffect 방식과 달리 시각적 점프가 발생하지 않음

### 구현 영향

- `src/app/layout.tsx` `<head>`에 inline script 추가 (1줄)
- `src/components/ScrollRestorationManual.component.tsx` 폐기 (PR #124의 이전 커밋에서 도입했던 부분 적용 컴포넌트)
- `src/app/type-effectiveness/page.tsx`에서 `<ScrollRestorationManual />` 호출 제거

### 추후 검토 사항

- 무한스크롤 페이지의 진짜 스크롤 복원 (이전 카드 위치 정확히 복원)이 필요하다는 판단이 서면 별도 ADR로 추가
- GA4에서 뒤로가기 후 재이탈률 변화를 4~8주 모니터링
- 사용자 피드백에서 "보던 카드 위치를 잃어 불편하다"는 신호가 누적되면 재검토

## 참고 자료

- [MDN — History.scrollRestoration](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration)
- [HTML Living Standard — scroll restoration mode](https://html.spec.whatwg.org/multipage/history.html#dom-history-scrollrestoration)
- [Next.js App Router 스크롤 동작](https://nextjs.org/docs/app/api-reference/components/link#scroll)
- 관련 작업: PR #124 (단계 C-1, C-2 — 타입 상성 결과 영역 인터랙션·CTA 강화)
- 연관 파일:
  - `src/hook/useInfiniteScroll.ts` (사이트 전반 무한스크롤 구현체)
  - `src/container/desktop/list/List.container.tsx` 외 4개 카드 페이지에서 사용
