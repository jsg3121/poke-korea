# ADR-0013: 챔피언스 상세 페이지 반응형 단일 레이아웃 — 완화된 2단(sticky 폐기)

- **상태**: 승인
- **날짜**: 2026-07-22
- **담당**: jsg3121 + Claude
- **대체**: [ADR-0003](./ADR-0003-champions-detail-layout.md) (챔피언스 상세 "좌측 sticky + 우측 스크롤" 2단 구조)

## 맥락

[ADR-0003](./ADR-0003-champions-detail-layout.md)(2026-04-19)은 챔피언스 포켓몬 상세 페이지의 **데스크톱** 레이아웃을 "좌측 sticky(고정 `w-96`) + 우측 스크롤" 2단 가로형으로 정했다. 그러나 이후 상황이 다음과 같이 바뀌었다.

1. **반응형 전환 결정([ADR-0007](./ADR-0007-responsive-rendering-strategy.md), 2026-06-16)** — 전체 UI를 UA 분기(적응형)에서 반응형 단일로 전면 개편하기로 했다. ADR-0003은 "데스크톱 레이아웃"만 다루며 모바일은 별도 UA 분기 컴포넌트(`ChampionsDetail.container.tsx` mobile)로 존재하는 것을 전제한다. 이 전제 자체가 ADR-0007과 충돌한다.
2. **문서-코드 괴리** — ADR-0003은 "좌측 sticky"를 핵심으로 명시했으나, 현재 `container/desktop/champions/ChampionsDetail.container.tsx`에는 `sticky` 클래스가 실제로 존재하지 않는다(`aside w-[420px] flex-shrink-0`만 있음). 결정이 코드에 온전히 반영되지 못한 채로 사실상 정적 2단이 되어 있었다.
3. **반응형 붕괴 리스크 실증([UX-010](../../research/reports/UX-010-champions-detail-redesign.md))** — 서버 UA 판별로 desktop 컨테이너가 좁은 뷰포트(예: 375px 반응형 모드, UA 위장, 태블릿)에 렌더되면 `w-[420px]` 고정폭 aside가 찌그러지고 우측 메타 텍스트가 글자 단위로 세로 개행되어 읽기 불가능해진다(WCAG 1.4.10 Reflow 위반). 이는 UA 분기 구조 자체의 결함이다.
4. **디자인 시스템 정합** — 일반 상세(`/detail`, [UX-005](../../research/reports/UX-005-detail-redesign.md))는 이미 반응형 단일로 개편되며 능력치를 레이더 차트에서 `StatBar`(가로막대)로 교체했다. 챔피언스 상세는 여전히 UA 분기 + 레이더 차트라 서비스 내 시각 언어가 이원화되어 있다.

## 결정

챔피언스 상세 페이지를 **반응형 단일 뷰**로 전환하고, 데스크톱 레이아웃을 **"완화된 2단"**으로 재정의한다. ADR-0003의 "sticky" 조항은 폐기한다.

1. **UA 분기 제거** — `renderChampionsDetail.tsx`의 `isMobile ? <Mobile/> : <Desktop/>` 분기와 desktop/mobile 컨테이너 2벌을 반응형 단일 컨테이너 1벌로 통합한다([ADR-0007](./ADR-0007-responsive-rendering-strategy.md) 준수).
2. **모바일 base = 세로 스택** — 폼탭 → 히어로 카드 → 능력치 → 메타 상세(기술/도구/특성/파트너) → 출처/도감 링크 순의 단일 컬럼.
3. **데스크톱(`desktop:` 769px 이상) = 완화된 2단** — 히어로 카드는 전폭 유지, 그 아래 좌측 능력치 컬럼 + 우측 메타 컬럼의 2단. 좌측 컬럼 폭은 고정 `w-[420px]`이 아니라 그리드 비율(`desktop:w-80`~`w-96` 범위, 1280px 컨테이너 대비 실측 확정)로 조정한다.
4. **sticky 폐기** — 좌측 컬럼은 `position: sticky`를 적용하지 않는다. 좌측 능력치 카드는 화면 높이보다 작아 sticky 이득이 제한적이고, 반응형 안정화가 우선이다. sticky 재도입은 후속 트랙으로 분리한다(필요 시 별도 결정).
5. **능력치 시각화 = `StatBar`로 교체** — canvas 레이더(`StatChart`)를 폐기하고 일반 상세와 동일한 `StatBar`(접근성 수치 DOM, 최고/최저 강조)를 재사용한다.
6. **타입 배지 = 신규 `tag/Tag.component`로 교체** — 구 `Tag.component`(전역 CSS 클래스) 대신 토큰 기반 신규 태그를 사용한다.

## 근거

### 왜 1단 세로가 아니라 "완화된 2단"인가

일반 상세([UX-005](../../research/reports/UX-005-detail-redesign.md))는 1단 세로로 갔지만, 챔피언스 상세는 성격이 다르다.

- 챔피언스 상세는 "메타 통계 도구" 페이지로, 능력치 외에 **인기 기술·도구·특성·추천 파트너 4블록**의 통계가 추가된다. 정보 밀도가 일반 상세보다 높아 1단 세로 시 체감 페이지 길이가 2배 이상으로 늘어난다.
- 벤치마크 레퍼런스([UX-001](../../research/reports/UX-001-champions-detail.md))인 Pikalytics·Smogon도 좌우 분할 구조를 사용한다. "포켓몬 정체성(이미지·능력치)을 한쪽에 두고 메타 통계를 스캔"하는 사용 맥락([ADR-0003](./ADR-0003-champions-detail-layout.md) §근거 1)은 여전히 유효하다.
- 다만 이 2단은 **데스크톱 전용**이며, 모바일에서는 반드시 1단으로 무너진다. ADR-0003이 놓쳤던 "모바일에서의 붕괴 방지"를 반응형 단일화로 명문화한다.

### 왜 sticky를 폐기하는가

- 현재 코드에 sticky가 이미 없어(문서-코드 괴리) 되살리는 것은 "복원"이 아니라 "신규 도입"이다.
- 능력치 카드(총합+6행, 약 300~360px)가 화면 높이보다 작아 sticky 이득이 제한적인 반면, 우측 메타 4블록(800px+)은 훨씬 길다. sticky는 좌측을 계속 보이게 하는 이득은 있으나 반응형 안정화의 필수 요소가 아니다.
- 이번 개편의 1차 목표는 반응형 붕괴 제거이므로, sticky는 후속 트랙으로 분리해 복잡도를 낮춘다.

### 근거 문서

- [ADR-0007](./ADR-0007-responsive-rendering-strategy.md) — 반응형 단일 전환 원칙(UA 분기 금지)
- [UX-010](../../research/reports/UX-010-champions-detail-redesign.md) — 4축 비평 + 반응형 재설계(본 ADR의 직접 근거)
- [WCAG 1.4.10 Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html) — 320~1280px 재구성 요구
- [.claude/conventions/guides/styling.md](../../conventions/guides/styling.md) — 모바일 퍼스트, `desktop:` 브레이크포인트

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| 1단 세로 스택(일반 상세와 동일) | 반응형 붕괴 원천 차단, 코드·시각 언어 완전 통일 | 메타 4블록으로 세로 길이 과다, 통계 비교 스캔 불리 | 챔피언스는 정보 밀도가 높은 "통계 도구"라 좌우 분할이 사용 맥락에 부합 |
| ADR-0003 유지(sticky 2단) | 기존 결정 존치 | 모바일 붕괴 미해결, 문서-코드 괴리, ADR-0007 위반 | 반응형 전환 전제와 정면 충돌 |
| 데스크톱도 sticky 재도입 | 좌측 정체성 상시 노출 | 반응형 안정화보다 복잡도 증가, 이득 제한적 | 후속 트랙으로 분리(이번 범위 밖) |

## 결과

- `renderChampionsDetail.tsx`의 UA 분기 제거 → 반응형 단일 뷰/컨테이너 1벌로 통합. desktop/mobile 컨테이너 2벌(약 300줄 중복) 제거 대상.
- 능력치가 `StatBar`로 교체되어 서비스 내 능력치 시각 언어가 일반 상세와 통일된다(접근성 개선 포함).
- 타입 배지가 신규 `tag/Tag.component`로 통일된다.
- 모바일에서 뷰포트/UA 판별과 무관하게 세로 스택으로 안정 렌더된다.
- 구버전 desktop/mobile 컨테이너 및 하위 컴포넌트(`ChampionsMetaSection.mobile.component.tsx` 등)는 사용처 0건 확인 후 제거([mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md) 4단계 방침, champions 전체 완료 후 일괄 제거 트랙).

## 참고 자료

- [ADR-0003: 챔피언스 상세 페이지 데스크톱 레이아웃 구조](./ADR-0003-champions-detail-layout.md) (본 ADR로 대체됨)
- [ADR-0007: 반응형 렌더링으로 전환](./ADR-0007-responsive-rendering-strategy.md)
- [UX-010: 챔피언스 상세 페이지 반응형 단일 개편](../../research/reports/UX-010-champions-detail-redesign.md)
- [UX-005: 일반 상세 개편(StatBar 도입 배경)](../../research/reports/UX-005-detail-redesign.md)
- [Nielsen Norman Group - Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)
