# UX-008: 기술 도감(/moves, C그룹) 반응형 단일 뷰 개편

- 작성일: 2026-07-15
- 에이전트: ux-designer
- 입력: 현행 `/moves`·`/moves/[id]`·`/moves/[id]/version/[versionGroupId]` 코드(views/container desktop·mobile, components/moves) + [UX-004](./UX-004-list-redesign.md)(리스트 필터 패턴) + [UX-006](./UX-006-detail-moves-redesign.md)(A그룹, MoveTable·버전 nav 패턴) + ability(B그룹) 신버전 구현(`src/views/ability/`, `src/container/ability/`) + DS 인벤토리
- 범위: 설계만(코드 미작성). 반응형 단일(ADR-0007)·모바일 퍼스트·DS 재사용 전제. page.tsx는 크롬(header/footer/tabbar)만 UA 분기, 콘텐츠는 반응형 단일. 광고 슬롯은 B그룹 선례에 따라 제거(§3 질문6)

---

## 1. 개요

C그룹은 `/moves`(목록) · `/moves/[id]`(상세) · `/moves/[id]/version/[versionGroupId]`(버전별 상세) 3라우트다. 목록은 검색·필터·무한스크롤 카드 그리드(도감 리스트와 동형 구조), 상세는 기술 정보 히어로 + 버전 nav + "이 기술을 배우는 포켓몬" 그리드(특성 상세와 동형 구조)로, C그룹은 **A그룹(습득기술)이 만든 DS(MoveTable, 버전 nav 패턴)와 B그룹(특성)이 만든 IA 패턴(목록 검색 승격 sticky, PokemonCardShell 확장 카드)을 동시에 소비하는 합류 지점**이다. 신규 DS를 새로 만들기보다 기존 자산을 최대한 재사용하는 것이 이번 설계의 핵심 방향이다.

---

## 2. 기존 화면 현황 분석 (4축 비평 요약)

코드 정독 기준(실캡처는 이번 트랙에서 별도 확보하지 않음 — A그룹 UX-006 §0에서 이미 동일 계열 결함을 실캡처로 확인했고, C그룹 목록/상세 카드도 구조적으로 동일 계열 컴포넌트를 쓰므로 코드 분석만으로 판단 근거 충분).

### Critical

**C1. 목록/상세 카드 3벌이 모두 구조가 다른데 데이터는 동일 — DS 부재로 인한 파편화**
- 문제: `MoveCard.component.tsx`(목록, 도감형 카드), `MoveListCard.component.tsx`(실제 목록에서 쓰이는 카드, `moveCard/`), `MoveDetailCard.component.tsx`(상세용)가 이름이 겹치면서 실제 사용처는 제각각이다.
- 근거: Nielsen Norman Group의 일관성 원칙 — 같은 개념(기술 1건 요약)이 화면마다 다른 시각 구조로 나타나면 사용자의 학습된 패턴이 매번 무효화된다. A그룹(UX-006 §0)에서 이미 "퍼센트 고정폭 flex-wrap dl 구조"가 텍스트 세로 깨짐(WCAG 1.4.10 Reflow 위반)을 일으킨 전례가 있음. 컴포넌트 파편화 자체가 유지보수 비용.
- 개선안: 목록은 **MoveListCard를 개편**(카드 유지, §3 질문1 근거), 상세의 "이 기술을 배우는 포켓몬"은 **PokemonCardShell 기반 카드**로 통일(B그룹 패턴 승계). 미사용 레거시(`components/moves/moveCard/MoveCard.component.tsx`, `MoveDetailCard.component.tsx`)는 폐기 대상으로 명시.

**C2. 목록 필터가 URL 쿼리를 갱신하지만 적용 필터가 상시 노출되지 않음**
- 문제: `FilterOptions.component.tsx`는 타입/데미지분류/세대 필터를 접이식 패널(`isOpenFilter` 토글) 안에 넣고, 선택 후 패널을 닫으면 무엇이 적용됐는지 화면에 남는 단서가 "총 N개" 카운트 변화뿐이다.
- 근거: Baymard Institute 필터 UX 연구 — 적용된 필터가 안 보이면 사용자는 "왜 결과가 줄었는지" 인과관계를 잃고, 필터를 걸었다는 사실 자체를 잊는다. UX-004가 도감 리스트에서 동일 문제를 M1으로 지적하고 AppliedFilterChip으로 해결한 전례.
- 개선안: 적용 필터 칩 로우(AppliedFilterChip)를 그대로 재사용.

### Major

**M1. 헤더+필터 sticky 좌표가 데/모 2벌로 하드코딩되고 서로 다른 값 사용**
- 문제: `MovesSearchAndFilter.component.tsx`가 `top-12 md:top-28`로 sticky를 걸지만, 이 값은 ability(top-12/top-30)·list(top-12/top-30)의 확정 좌표(전역 헤더 모바일 48px, 데스크톱 실높이 120px)와 다르다(`top-28`=112px, 헤더 실측과 8px 어긋남).
- 개선안: ability/list와 동일한 확정 좌표(`top-12 desktop:top-30`)로 통일.

**M2. 상세 페이지 버전 nav가 데/모 완전히 다른 컴포넌트(구조 중복)**
- 문제: desktop/mobile MoveDetail.container가 거의 동일한 JSX를 `flex flex-wrap`(데스크톱) vs `overflow-x-auto`+`scrollIntoView`(모바일)로 각각 구현.
- 개선안: A그룹에서 검증된 반응형 단일 `MovesVersionNav`를 재사용(§3 질문3).

**M3. "이 기술을 배우는 포켓몬" 카드가 도감/특성 카드와 다른 구버전 셸(`useDevice` UA 분기 이미지 크기)**
- 문제: `PokemonBySkillCard.component.tsx`는 `useDevice()`로 이미지 크기를 분기하는 구버전 패턴 — B그룹이 이미 `PokemonByAbilityCard`에서 제거한 패턴.
- 근거: styling.md "금지/지양" — 신규 UA 기반 분기 금지, 클라이언트 viewport 측정 금지(CLS 유발).
- 개선안: `PokemonCardShell` 기반 카드로 교체(§3 질문4).

### Minor

- **m1.** 목록 빈 상태가 텍스트만 (재시도 CTA 없음) → EmptyState + "필터 초기화" CTA (ability/list 동일 패턴)
- **m2.** 상세 "배우는 포켓몬" 빈 상태도 텍스트만 → EmptyState 교체
- **m3.** 로딩 상태가 순수 텍스트("로딩 중...") → 카드 스켈레톤 (ability/list 선례)
- **m4.** 검색 인풋이 DS SearchInput 미사용, 구버전 gray/blue 비토큰 색(`border-gray-300` 등) → SearchInput DS로 교체

---

## 3. 확정 질문에 대한 결정 + 근거

### 질문 1 — 목록 카드 vs MoveTable vs 하이브리드

**결정: 카드 그리드 유지(MoveListCard 개편), MoveTable로 교체하지 않는다.**

| 근거 | 설명 |
|---|---|
| 정보 밀도 목적 차이 | MoveTable은 "포켓몬 1마리가 배우는 기술 목록"(특정 맥락 안 나열, 습득조건이 핵심 축)에 최적화된 컴팩트 행. `/moves` 목록은 "기술 도감 전체를 탐색"하는 카탈로그 페이지 |
| 기존 페이지 일관성 | 도감 리스트(`/list`)·특성 목록(`/ability`)이 모두 **카드 그리드**로 확정(UX-004, B그룹). 목록 3형제(포켓몬/특성/기술)의 IA를 카드로 통일하면 탐색 패턴을 도감 전체에서 재사용 가능 |
| MoveTable의 설계 의도 | UX-006 §5는 MoveTable을 "설명 필드를 의도적으로 제외"(행당 ~64px)하도록 설계 — 상세 페이지의 좁은 목록형 슬롯용 최적화 |
| 터치 타겟/스캔 효율 | 카드 그리드는 격자 스캔에 적합하고 아이콘·칩·색상 신호(타입, 데미지분류)를 카드당 크게 배치 가능 |

하이브리드(모바일 테이블/데스크톱 카드)는 반응형 단일 원칙과 상충, 목록 3형제 일관성도 깨뜨리므로 채택하지 않는다.

**MoveListCard 개편 방향**: 구버전(grid-cols-3 dl, 비교적 안전한 구조)을 존치하되 DS 토큰 정합(임의값 제거), 데미지분류를 Chip(color) DS로 교체, 타입 아이콘을 TagComponent로 통일.

### 질문 2 — 검색·필터 UX

**결정: FilterBar organism을 그대로 이식하지 않고, ability(B그룹)의 "검색 승격 sticky" 패턴 + 도감 리스트의 "적용 필터 칩" 개념을 결합한 기술 전용 organism(`MovesFilterBar`, 신규)으로 조립한다.**

근거:
1. **필터 축의 성격이 다르다.** 도감 리스트 FilterBar는 타입(다중 최대 2개) 1차 + 모달 2차 구조. 기술 목록의 축은 타입(18종)·데미지분류(3종)·첫 등장 세대(9종) 3가지 모두 **단일 선택**.
2. **원자 재사용은 하되 organism 그대로 이식은 과설계.** TypeChip·AppliedFilterChip·Chip 원자는 그대로 재사용.
3. **검색 승격 sticky는 ability 패턴 그대로.** 기술명 검색은 1차 과업(Baymard "검색은 필터보다 발견성이 중요") — 검색 인풋+결과 카운트를 sticky 최상단 승격.

**최종 구조 (목록 sticky 크롬, 위→아래)**:
```
[검색 인풋 + "총 N개" 카운트]  (SearchInput DS, ability 패턴)
[타입 칩 가로 스크롤(18종, 단일 선택)]  (TypeChip 재사용, 단일선택 모드)
[데미지분류 3종 + 세대 9종 — 칩 그룹]  [초기화]
[적용 필터 칩 로우]  (AppliedFilterChip, 조건부)
```

TypeChip은 현재 checkbox 시맨틱(다중 선택). 기술 목록은 단일 선택 — §10 질문3 참조.

데미지분류(물리/특수/변화)는 구버전 `badge-damage-*` 대신 Chip(color=physical/special/status) 원자로 교체 — MoveTable이 이미 이 색 매핑(`DAMAGE_LABEL`, `ChipColor`)을 쓰고 있어 도감 전체 통일.

### 질문 3 — 상세 버전 nav

**결정: A그룹 `MovesVersionNav`를 그대로 재사용. "최신" 항목을 nav 리스트 맨 앞에 prepend하고, href 빌더만 다르게 구성한다.**

근거:
1. `/moves/[id]/version/[versionGroupId]`는 A그룹 detail/moves의 버전 전환과 완전히 동일한 성격(URL 세그먼트로 버전 전환, 데이터만 재조회).
2. 재사용 조건(가로 스크롤+페이드+active 자동 스크롤인+Link 기반) 100% 일치. **ADR-0010에 따라 이번 트랙에서 공용 위치로 승격** — 재사용처가 실제로 발생.
3. 차이는 "최신" 항목뿐 — `{ versionGroupId: 0(sentinel), label: '최신', href: '/moves/{id}', active: !currentVersionGroupId }`를 배열 맨 앞에 prepend하면 컴포넌트 변경 없이 해결.

**승격 위치 제안**: `src/components/moves/MovesVersionNav.component.tsx` (A그룹 로컬 컴포넌트 이동, 양쪽 import 갱신).

### 질문 4 — 이 기술을 배우는 포켓몬 그리드

**결정: B그룹 `PokemonByAbilityCard` 방식(PokemonCardShell 셸 공유 + 전용 카드)을 그대로 적용해 `PokemonBySkillCard`를 개편한다.**

- 셸(Link+article+포켓볼+이미지+타입 태그+그라데이션)은 `PokemonCardShell`에 위임, 카드는 헤더(No.+이름)와 본문(습득 방법 배지)만 책임.
- **습득 방법 배지**: `methods` 배열 순회 — LEVEL_UP 레벨업 아이콘+라벨, MACHINE 기술머신 아이콘+라벨. PokemonByAbilityCard의 "배지 영역 min-h-6·좌측 정렬" 패턴 승계(배지 유무 무관 높이 고정).
- ~~레벨 숫자 병기~~ → **확인 결과 불가**: `PokemonLearnMethod`에는 `method`(LEVEL_UP/MACHINE/EGG)만 존재, 레벨 필드 없음 (2026-07-15 스키마 확인). 라벨만 표기. EGG enum 존재 — 알 그룹 배지 라벨 필요 여부는 구현 시 데이터 확인.
- 아이콘(`LevelUpIcon`, `MachineMoveIcon`)은 기존 svg 자산 재사용.

### 질문 5 — 기술 상세 히어로

**결정: 포켓몬 상세(UX-005)의 히어로 톤(`card-detail` 카드형 컨테이너, 좌측 정렬 타이틀, dl 기반 스탯)과 시각적으로 일관되게 재구성하되, 이미지 없는 텍스트/배지 중심 "미니 히어로"로 설계한다.**

정보 구조(위→아래):
```
[뒤로가기: ← 기술 도감으로 돌아가기]  (ability 패턴)
[기술명 h1] [Z기술 배지 (조건부)] [삭제된 기술 배지 (조건부)]
[타입 Tag] [데미지분류 Chip]
[위력 | 명중률 | PP]  (dl, 임의값 토큰화)
[설명 텍스트]  (text-base, ADR-0012)
[(버전별 조회 시) "버전: OO" 배지]
```

- **이미지 슬롯 없음 확정**: `PokemonSkillDetail` 스키마에 이미지 필드 없음 (2026-07-15 확인).
- 임의값 제거: `text-[2.5rem]` 등 → `text-2xl desktop:text-4xl`, 본문 `text-base`.
- 데미지분류는 Chip(color) 원자로 통일(구버전 색 텍스트 → 배지 승격).

### 질문 6 — 광고 슬롯 제거

**결정: 동일 적용. C그룹 전체에서 광고 슬롯 제거.**

- 대상: `DesktopMovesTopBanner`, `MobileMovesTopBanner`, `DesktopMovesDetailTopBanner`, `MobileMovesDetailBottomBanner`.
- 근거: A그룹(UX-006 §6)과 동일 결정 — 홈·리스트·특성·습득기술 전 트랙 일관 방침. 반응형 광고 유닛 재도입은 별도 보류 트랙.

---

## 4. 라우트별 레이아웃

### 4-1. `/moves` 목록

#### 모바일 (375px)

```
┌─────────────────────────────────┐
│ POKEKOREA      [검색 🔍]  [☰]   │ h-12 전역 헤더 (크롬)
├─────────────────────────────────┤
│ 포켓몬 기술 도감                  │ PageHeader (title+desc)
│ 포켓몬이 사용할 수 있는...         │
├─────────────────────────────────┤ ─┐
│ [기술 이름으로 검색...........] │  │ sticky top-12
│ 총 812개의 기술을 볼 수 있어요!  │  │ (검색+카운트, ability 패턴)
│ 🔥💧🌿⚡❄️🥊☠️⛰️ →(가로스크롤)  │  │ 타입 칩(18, 단일선택)
│ [물리][특수][변화]  [1~9세대 ▾] │  │ 분류+세대 칩 행
│ [필터 더보기 ▾]      [초기화]   │  │ 액션바
│ [불꽃 ×]                        │ ─┘ 적용 필터 칩(조건부)
├─────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐       │
│ │몸통박치기│ │ 100만볼트│       │ 카드 그리드 (열 수 §10-1)
│ │🔥 위력35 │ │⚡ 위력90 │       │
│ │명중100 PP35│명중100 PP15│      │
│ └──────────┘ └──────────┘       │
│      ...(자동 로드)...           │
│ ┌skeleton┐  ┌skeleton┐          │ 로딩 스켈레톤
│ Footer / MobileTabBar            │
└─────────────────────────────────┘
```

#### 데스크톱 (1280px)

```
┌──────────────────────────────────────────────┐
│ LOGO  [    검색    ]        [기능/오류 신고]   │ fixed 헤더 120px
│ 홈 도감 기술 특성 상성 퀴즈                    │
├──────────────────────────────────────────────┤ ─┐
│ 포켓몬 기술 도감 / 설명                        │  │ PageHeader
├──────────────────────────────────────────────┤  │
│ [기술 이름으로 검색.................]         │  │ sticky top-30
│ 총 812개의 기술을 볼 수 있어요!                │  │ 검색+카운트
│ 🔥💧🌿⚡❄️🥊☠️⛰️…(18종 한 줄)                 │  │ 타입 칩
│ [물리][특수][변화]   [1세대][2세대]...[9세대]  │  │ 분류+세대 칩
│ [필터 더보기 ▾]                    [초기화]   │ ─┘ 액션바
├──────────────────────────────────────────────┤
│ [카드][카드][카드][카드]  auto-fill 3~4열      │
│ [카드][카드][카드][카드]                       │
│       ...(자동 로드)...                        │
│                Footer                          │
└──────────────────────────────────────────────┘
```

**그리드 열 수**: 기술 카드는 정보량이 많아(타입·분류·위력·명중·PP) 도감 카드보다 폭이 더 필요. `grid-cols-1 desktop:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]` 제안 — 모바일 1열 vs 2열은 §10-1 오픈 퀘스천(시안 병행 검토).

### 4-2. `/moves/[id]` 상세 (버전별 상세도 동일 레이아웃, 표시 데이터만 다름)

#### 모바일 (375px)

```
┌─────────────────────────────────┐
│ POKEKOREA      [검색 🔍]  [☰]   │ h-12 전역 헤더
├─────────────────────────────────┤
│ [← 기술 도감으로 돌아가기]       │
│                                   │
│ 지구던지기                        │ h1
│ [땅] [물리]                      │ 타입+분류
│ 위력 65 | 명중 100 | PP 20        │ 스탯 dl
│                                   │
│ 상대를 땅에 내던져 공격한다.       │ 설명
├─────────────────────────────────┤ ─┐
│ 최신 스칼렛·바이올렛 소드·실드 ▸  │  │ sticky top-12
│ (가로스크롤, active 자동스크롤인) │ ─┘ 버전 nav
├─────────────────────────────────┤
│ 128마리의 포켓몬이 이 기술을      │ h2 카운트
│ 배울 수 있어요                    │
│ ┌──────────┐ ┌──────────┐       │
│ │ No.001   │ │ No.004   │       │ grid-cols-2
│ │ 이상해씨  │ │ 파이리   │       │ (PokemonBySkillCard)
│ │[레벨업]  │ │[기술머신]│       │
│ └──────────┘ └──────────┘       │
│      ...(자동 로드)...           │
│ Footer / MobileTabBar            │
└─────────────────────────────────┘
```

#### 데스크톱 (1280px)

```
┌──────────────────────────────────────────────┐
│ LOGO  [    검색    ]        [기능/오류 신고]   │ fixed 헤더
├──────────────────────────────────────────────┤
│ [← 기술 도감으로 돌아가기]                     │
│ 지구던지기                                     │ h1 (좌측 정렬)
│ [땅] [물리]  위력 65  명중 100  PP 20          │ 한 줄 요약
│ 상대를 땅에 내던져 공격한다.                    │ 설명
├──────────────────────────────────────────────┤ ─┐ sticky top-30
│ 최신 | 스칼렛·바이올렛 | 소드·실드 | ...       │ ─┘ 버전 nav(한 줄)
├──────────────────────────────────────────────┤
│ 128마리의 포켓몬이 이 기술을 배울 수 있어요     │ h2
│ [카드][카드][카드][카드][카드]  grid-cols-5    │
│ [카드][카드][카드][카드][카드]                 │
│                Footer                          │
└──────────────────────────────────────────────┘
```

---

## 5. 컴포넌트 매핑

| 영역 | 컴포넌트 | 처리 | 근거 |
|---|---|---|---|
| 목록 헤더 | `PageHeaderComponent` | 재사용 그대로 | ability/list와 동일 |
| 목록 검색+카운트 | `SearchInputComponent` + sticky 래퍼 | 재사용(원자) + 신규 조립(`MovesSearchContainer`, ability `AbilitySearchContainer` 동형) | §3 질문2 |
| 목록 타입 필터 | `TypeChipComponent` | 재사용(원자), 단일 선택 로직은 organism 담당 | §3 질문2 |
| 목록 분류/세대 필터 | `ChipComponent`(clickable) | 재사용(원자) | §3 질문2 |
| 목록 적용 필터 칩 | `AppliedFilterChip` | 재사용 그대로 | UX-004 패턴 승계 |
| 목록 필터 조립 | `MovesFilterBar`(신규 organism) | 신규 | 필터 축 성격 차이 |
| 목록 카드 | `MoveListCard.component` | 개편(임의값 제거·Chip/Tag DS 정합) | §3 질문1 |
| 목록 로딩 | `MoveListCardSkeleton`(신규) | 신규 (PokemonCardSkeleton 패턴 준용) | m3 |
| 목록 빈 상태 | `EmptyStateComponent` | 재사용 (아이콘 `movesList.svg`) | m1 |
| 상세 히어로 | `MoveDetailHero`(신규 컨테이너) | 신규 — 구버전 `MoveDetail.component` 대체 | §3 질문5 |
| 상세 뒤로가기 | 로컬 링크(ability 패턴 준용) | 패턴 재사용 | §3 질문5 |
| 상세 버전 nav | `MovesVersionNav.component`(A그룹 자산) | **재사용(승격 이동)** — "최신" sentinel prepend는 호출부 책임 | §3 질문3 |
| 배우는 포켓몬 카드 | `PokemonBySkillCard.component` | 개편(PokemonCardShell 셸 적용) | §3 질문4 |
| 배우는 포켓몬 로딩 | `PokemonCardSkeleton` | 재사용 (크기 SSOT 공유) | m2 |
| 상세 빈 상태 | `EmptyStateComponent` | 재사용 그대로 | m2 |
| 데미지분류 배지 | `ChipComponent`(color=physical/special/status) | 재사용 — MoveTable과 팔레트 통일 | §3 질문2·5 |
| 타입 배지 | `TagComponent` | 재사용 그대로 | 전역 패턴 |
| 폐기 대상 | `moveCard/MoveCard.component.tsx`, `MoveDetail.component.tsx`, `MoveDetailCard.component.tsx`, 구버전 `PokemonBySkillCard` | 폐기(일괄 제거 트랙) | C1, M3 |
| 폐기 대상(UA 분기) | `views/{desktop,mobile}/moves/**`, `container/{desktop,mobile}/moves/**` | 반응형 단일화로 폐기(일괄 제거 트랙) | ADR-0007 |

---

## 6. 신규 컨테이너/뷰 계층 (제안)

```text
MovesListView (신규, views/moves/)
 └─ MovesSearchContainer (신규 — ability AbilitySearchContainer 동형, sticky 최상단)
 └─ MovesFilterBarContainer (신규 organism 조립 — 타입/분류/세대 칩 + 적용 필터 칩)
 └─ MovesListGridContainer (신규 — list ListGridContainer 동형: 빈 상태/스켈레톤/무한스크롤)
     └─ MoveListCard (개편)

MoveDetailView (신규, views/moves/)
 └─ MoveDetailHeroContainer (신규 — 뒤로가기 + 기술 정보 요약)
 └─ MovesVersionNavContainer (신규 — MovesVersionNav 재사용 + '최신' prepend 책임)
 └─ PokemonBySkillListContainer (신규 — ability PokemonByAbilityContainer 동형: 카운트 h2 + 그리드 + 무한스크롤)
     └─ PokemonBySkillCard (개편)
```

`/moves/[id]`와 `/moves/[id]/version/[versionGroupId]`는 동일한 `MoveDetailView` 공유(`selectedVersionGroupId` optional prop 패턴 승계). page.tsx 크롬 UA 분기는 ability/list 확정 패턴 그대로.

---

## 7. 인터랙션·상태 정의

### 로딩

| 구간 | 방식 |
|---|---|
| 최초 진입(SSR) | 서버 렌더 first 20 (기존과 동일) |
| 추가 로드(스크롤) | `useInfiniteScroll` 재사용, 카드 스켈레톤 4개(ability/list 동일 수치) + `role="status"` sr-only 알림 |
| 필터 변경 | URL 쿼리 갱신 → 재조회. 필터는 즉시 반영(옵티미스틱), 결과는 스켈레톤 전환 |

### 빈 상태

- 목록: "검색하신 조건의 기술이 존재하지 않아요" + "필터 초기화" CTA (EmptyState, 아이콘 `movesList.svg`)
- 상세(0마리): "이 기술을 배울 수 있는 포켓몬이 없어요" (EmptyState, 뒤로가기 링크가 상단에 있어 액션 CTA 생략 — ability 상세와 동일 판단)

### 에러 / 성공 피드백

- Apollo 기본 에러 경계 현행 유지(A/B그룹과 동일, 신규 에러 UI는 범위 밖).
- 필터 적용/해제는 카운트 즉시 갱신 + 적용 필터 칩 반영으로 피드백 충분(토스트 불필요).

---

## 8. 반응형 전략

- **그리드**: base 1열(§10-1에서 확정), `desktop:` auto-fill 최소 300px. 배우는 포켓몬 그리드는 도감 셸 SSOT 규격(grid-cols-2 → 데스크톱 5열 계열)
- **필터바 sticky**: `top-12 desktop:top-30` (M1 수정)
- **버전 nav sticky**: `top-12 desktop:top-30` (상세엔 필터바가 없어 버전 nav가 그 자리)
- **터치 타겟**: 필터 칩 `h-7`(28px, ADR-0011 슬림 계열), 필터/초기화 버튼 `min-h-8 desktop:min-h-9`
- **gutter**: 모바일 `px-4`(16px), 콘텐츠 `max-w-7xl`(기존 `max-w-[1280px]` 토큰화)
- **본문 텍스트**: `text-base` (ADR-0012 반응형 토큰)

---

## 9. 접근성

- 필터: `role="search"` 래퍼. 타입 칩 단일 선택 시맨틱은 §10-3 참조
- 버전 nav: `aria-current="page"` (A그룹 구현 승계, 검증済)
- 카운트 문구("N마리의 포켓몬이...")는 h2 승격 (ability 패턴)
- 추가 로드 알림 `role="status"` sr-only 1회, 스켈레톤 `aria-hidden`
- 데미지분류 Chip은 텍스트 라벨(물리/특수/변화) 항상 병기 (WCAG 1.4.1)
- 카드 그리드 `<ul>`/`<li>` 시맨틱 + `aria-label` (list/ability 패턴 승계)

---

## 10. 오픈 퀘스천 (사용자 확인 필요)

1. ~~모바일 카드 그리드 열 수~~ — **확정(2026-07-15, 시안 비교 후 사용자 결정): 1열(넉넉한 밀도)**. 위력/명중/PP dl 3분할 유지, 데스크톱은 auto-fill.
2. ~~필터 UI 접이식 vs 상시 노출~~ — **확정(2026-07-15, 사용자 결정): 접이식(기본 접힘)**. 검색+카운트만 상시 sticky, "필터 ▾" 버튼으로 타입/분류/세대 행 펼침. 적용 필터 칩은 접힘 상태에서도 상시 노출(C2 해결 유지).
3. ~~타입 필터 단일 선택 시맨틱~~ — **확정(2026-07-15, 사용자 결정): (b) TypeChip에 `mode: 'single'|'multi'` prop 추가**(radio 시맨틱 지원, 기존 다중 선택 호출부 무영향).
4. ~~기술 아이콘/이미지 자산~~ — **해소**: 스키마에 이미지 필드 없음 → 텍스트/배지 히어로 확정 (2026-07-15).
5. ~~레벨 숫자 노출~~ — **해소**: `PokemonLearnMethod`에 `method`만 존재 → 라벨만 표기. EGG enum 존재, 알 배지 필요 여부는 구현 시 확인 (2026-07-15).
6. **`?page=N` SEO 페이지네이션** — 도감 리스트와 동일 리스크이나, 이번 1차에서는 자동 무한스크롤만 적용하고 리스트 보류 트랙과 함께 후속 제안.
7. **버전별 상세 canonical** — URL 구조 변경 없어 이번 트랙에서 이슈 없음으로 판단, seo-specialist 확인 권고(SEO 2단계 트랙).

---

## 요약 — 핵심 결정 5가지

1. **목록은 카드 그리드 유지**(MoveTable 미도입) — 카탈로그 목적·목록 3형제 일관성
2. **필터는 원자만 재사용**해 기술 전용 `MovesFilterBar`(신규) 조립 — 단일선택 3축 구조
3. **버전 nav는 A그룹 `MovesVersionNav` 승격 재사용** — "최신" sentinel prepend만 호출부 책임
4. **배우는 포켓몬 카드는 B그룹 패턴(PokemonCardShell 셸 공유)** 적용해 `PokemonBySkillCard` 개편
5. **광고 슬롯 전면 제거** (A/B그룹 관례), 반응형 유닛은 별도 보류 트랙
