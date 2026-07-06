# UX-004: 도감 리스트(/list) 전면 재설계

- 작성일: 2026-07-06
- 에이전트: ux-designer
- 입력: [RES-002](RES-002-list-page-reference.md) + 현행 /list 코드 + 실화면 캡처(.claude/playwright/screenshots) + DS 인벤토리
- 범위: 설계만(코드 미작성). 반응형 단일(ADR-0007)·모바일 퍼스트·DS 조립 전제. 홈 개편(PR #179) 확립 패턴 계승(크롬/광고만 UA 허용, gutter px-4).

---

## 1. 기존 /list 비평 (4축)

### 🔴 Critical
**C1. 스크롤 시 카드가 fixed 헤더 뒤로 파고들어 잘림 (실캡처 확인)**
- 데스크톱: `HeaderContainer`(fixed) 내부에 FilterComponents가 렌더돼 실제 헤더 높이가 가변인데, 뷰의 스페이서는 `h-44`(176px) 고정 → 오프셋 어긋남. 모바일: `SearchComponent`가 자체 `fixed`(isScroll 상태) 레이어를 만들어 FilterComponents와 좌표 충돌 — 두 독립 fixed/sticky 레이어가 서로의 높이를 모른 채 하드코딩.
- 개선: 크롬(헤더+필터바)을 **단일 sticky 블록**으로 통합(React 상태 기반 fixed 전환 대신 순수 CSS sticky).

**C2. 무한스크롤 전용 + sitemap 필터 URL 대량 등재의 SEO 모순**
- 서버는 `first: 20`만 렌더, 이후는 스크롤 fetchMore뿐 — Google은 스크롤을 트리거하지 않음(RES-002). 그런데 `sitemap.ts`는 `/list?type=X`(18)·`?generation=N`(9)·불리언(5) 조합을 **priority 0.8·daily로 등재** → 크롤 예산을 쓰면서 반쪽 콘텐츠 제공. 검색 유입 83% 서비스의 핵심 손실 지점.
- 개선: `?page=N` 서버 렌더 페이지네이션 + self-canonical + `<a href>` 순차 링크(§3). 롱테일 조합은 noindex 검토.

### 🟡 Major
**M1. ISR 1년 + `headers()` UA 감지 공존** — `headers()` 호출이 동적 렌더를 강제해 `revalidate=31536000` 선언이 무의미(fetchPolicy도 network-only). 코드가 "1년 캐시"라는 거짓 신호 전달. UA 분기 제거 시 자연 해소.
**M2. 카드 데/모 2벌** — `pokemonCard/desktop`·`mobile` 구버전 사용, 그리드 5열/2열 하드코딩 분리. DS 반응형 단일 `PokemonCard`(variant=pokedex)로 교체 + `grid-cols-2 desktop:grid-cols-5`.
**M3. 모바일 전용 리스트 헤더(min-h-60=240px)** — 데스크톱은 "전역 헤더가 /list 인식해 주입", 모바일은 "페이지가 자체 헤더 소유"로 아키텍처 이원화. → **전역 헤더 + FilterBar organism으로 통합**(§2).

### 🟢 Minor
**m1. 빈 상태에 재시도 동선 없음** — 텍스트 2줄뿐. "필터 초기화" CTA(Button) 인라인 추가.
**m2. 더보기 로딩이 순수 텍스트** — 카드 스켈레톤(PokemonCardShell의 animate-pulse 패턴 재사용)으로 통일.

## 2. 새 페이지 구조 (IA)

```
전역 Header (크롬, UA 허용 — 홈 패턴)
 └─ FilterBar organism (헤더 하단에 이어붙인 단일 sticky 블록)
     ├─ TypeChip 18종 (모바일 가로 스크롤 / 데스크톱 한 줄)
     ├─ 적용 필터 칩 로우 (신규 — 세대·메가 등 모달 필터도 X버튼 칩으로 상시 노출)
     └─ [필터] [초기화]
[광고 TopBanner]
 ├─ PokemonCard 그리드 (grid-cols-2 desktop:grid-cols-5, 반응형 단일)
 ├─ (로딩 시 카드 스켈레톤 N개)
 └─ [더보기] 버튼 = <a href="?page=N+1"> (자동 로드 상한 후 — 유일한 페이지네이션 UI,
    숫자 내비 없음. 개정 §3 참조)
Footer / MobileTabBar
```

**모바일 전용 헤더 통합 판단: 통합한다** — (a) 데스크톱과 합성 아키텍처 통일(전역 헤더가 /list 인식해 검색+FilterBar 주입) (b) SearchComponent 독자 fixed 로직이 C1의 원인이라 근본 해결 (c) 홈 개편 확립 패턴(전역 모바일 헤더 h-12 검색 내장)과 일치.

## 3. 로딩·SEO 아키텍처

### 하이브리드 로딩 (트랙 A — API 불필요)
| 구간 | 방식 |
|---|---|
| 0~20 (1페이지) | SSR 유지 (LCP 보장) |
| ~상한 (모바일 60 / 데스크톱 100 후보) | 스크롤 자동 fetchMore — 기존 `useInfiniteScroll` 재사용 |
| 상한 이후 | **"더보기" 버튼** 클릭 로드 (Baymard 권장, CLS 500ms 규칙상 유리) |

`ListProvider`에 로드 카운터 파생 상태만 추가 — API 변경 없이 구현 가능.

### SEO 페이지네이션 (개정 2026-07-06 — 백엔드 수정 없이 트랙 A로 이동)
> **개정 근거(사용자 논의)**: ①숫자 페이지네이션 내비를 시각 노출하면 무한스크롤로
> 내려온 사용자가 바닥에서 처음 보는 페이지 개념과 충돌해 혼란 ②커서 전용 API로도
> `?page=N` 서버 렌더가 가능(offset 불필요).

- **"더보기" 버튼 = `<a href="?page=N+1">` progressive enhancement가 유일한 페이지네이션 UI.**
  JS가 클릭을 가로채 fetchMore + `history.replaceState`(사용자는 무한스크롤 UX 그대로,
  숫자 내비 없음) / 크롤러는 a href를 순차로 따라가 전 페이지 발견(Google 공식 패턴).
- `?page=N` 직접 진입 시 서버 렌더: 커서 전용 API로 **`first: N×20`을 받아 마지막
  20개만 렌더**(해당 구간 + endCursor 확보 → 이어서 더보기 가능). 페이지별 ISR로 페이로드
  상각. **백엔드 확인 1건: `first` 파라미터 상한 존재 여부**(상한이 N×20보다 작으면 그때 협의).
- 각 `?page=N`은 self-canonical (`rel=next/prev`는 Google 폐기).
- `totalCount`는 숫자 내비가 없으므로 **SEO에 불필요** → "결과 수 표시(N마리)" 용도의
  선택 최적화로 강등(트랙 B).
- 뒤로가기 복원: `useRouteChangeCache`는 필터 변경 시 Apollo 캐시 evict 용도(스크롤 복원 아님) — 로드 페이지 수+스크롤 Y를 세션 상태로 복원하는 로직 필요(Baymard "90% 잘못 구현" 검증 대상)

### ISR 재정의
UA 감지 제거 후: **무필터 첫 페이지만 ISR**, 필터 적용 시 클라이언트 패칭(현행 ListProvider) 유지 — 1차안(구조 변경 최소).

## 4. 필터·검색 UX

- **FilterBar/FilterModal organism 그대로 채택** — 타입 즉시 반영 + 모달 일괄 제출 분담이 Baymard 데스크톱/모바일 패턴과 이미 일치
- **적용 필터 칩 로우 (신규)**: 모달 필터(세대·메가 등)는 현재 적용 후 보이지 않음 → URL 쿼리 전체를 X버튼 칩으로 FilterBar 하단에 상시 노출(개별 해제 + 전체 초기화 2층위)
- **결과 수 표시**: `totalCount` 부재 확인 — **API 변경 필요, 후순위**(트랙 B)
- 빈 상태 CTA가 초기화 동선 재사용

## 5. 섹션별 레이아웃·DS 매핑

| 섹션 | 모바일 → 데스크톱 | DS | 신규 후보 |
|---|---|---|---|
| 필터바 | FilterBar organism 그대로 | ✓ | **적용 필터 칩 로우**(FilterBar 확장) |
| 카드 그리드 | `grid-cols-2` → `desktop:grid-cols-5` | PokemonCard(pokedex) | 없음(교체만) |
| 빈 상태 | 텍스트+CTA | Button 재사용 | 빈 상태 컴포넌트(아이콘+텍스트+CTA) |
| 로딩 | 스켈레톤 N개 | Shell pulse 패턴 | **카드 스켈레톤** |
| 더보기 | 중앙 min-h-touch, **`<a href="?page=N+1">` progressive enhancement** | LinkButton 재사용(조립만) | 없음 (숫자 PaginationNav는 개정으로 제거) |
| 광고/푸터/탭바 | 기존 유지(크롬) | — | — |

## 6. 와이어프레임

### 모바일 375px
```
┌─────────────────────────────────┐
│ POKEKOREA      [검색 🔍]  [☰]   │ h-12 전역 헤더 ┐
│ ○🔥💧🌿⚡❄️🥊☠️⛰️ →(가로스크롤) │ FilterBar      │ 단일 sticky 블록
│ [필터]              [초기화]     │ 액션 바        │
│ [불꽃 ×] [3세대 ×]               │ 적용 필터 칩(신규) ┘
├─────────────────────────────────┤
│         (광고 배너)              │
│ ┌────────┐  ┌────────┐          │
│ │ No.001 │  │ No.002 │          │ grid-cols-2
│ └────────┘  └────────┘          │
│      ...(자동 로드 ~60)...       │
│ ┌skeleton┐  ┌skeleton┐          │ 로딩 스켈레톤
│        [ 더보기 ]                │ 상한 도달 후 (a href=?page=N+1)
│ Footer / MobileTabBar            │
└─────────────────────────────────┘
```

### 데스크톱 1280px
```
┌──────────────────────────────────────────────┐
│ LOGO  [    검색    ]        [기능/오류 신고]   │ fixed 헤더
│ 홈 도감 기술 특성 상성 퀴즈                    │ HeaderNav
│ ○🔥💧🌿⚡…(18종 한 줄)  [필터] [초기화]        │ FilterBar
│ [불꽃 ×] [3세대 ×]                            │ 적용 필터 칩
├──────────────────────────────────────────────┤
│              (광고 배너)                       │
│ [C][C][C][C][C]  grid-cols-5                  │
│ [C][C][C][C][C]                               │
│      ...(자동 로드 ~100)...                    │
│              [ 더보기 ]  (a href=?page=N+1)    │
│                Footer                          │
└──────────────────────────────────────────────┘
```

## 7. 단계별 구현 순서

### 트랙 A — 클라이언트 전용 (즉시 착수 가능)
1. **크롬 sticky 통합** (C1 해결) — 헤더+FilterBar 단일 sticky 블록, 모바일 SearchComponent 독자 fixed 제거
2. **카드 교체** — 구버전 2벌 → DS PokemonCard + `grid-cols-2 desktop:grid-cols-5` 단일화
3. **필터 organism 교체** — 구 Filter.components 2벌 → FilterBar/FilterModal
4. **모바일 전용 헤더(min-h-60) 제거** — 전역 헤더 주입 패턴으로 통합 (1번 선행 필요)
5. **UA 감지 제거 + ISR 재정의** — 무필터 첫 페이지 ISR / 필터 시 클라이언트 패칭
6. **하이브리드 로딩 + SEO 더보기** — 자동 로드 상한(모60/데100) + **더보기 = `<a href="?page=N+1">` progressive enhancement**(ListProvider 카운터 + History replaceState). `?page=N` 진입 시 서버가 `first: N×20` 슬라이스 렌더 + self-canonical (개정 §3 — 백엔드 수정 없이 가능, `first` 상한만 확인)
7. **적용 필터 칩 로우** — URL 쿼리 파싱 표시 (API 불필요)
8. **빈 상태 CTA + 로딩 스켈레톤** (신규 컴포넌트 + story)
9. 뒤로가기 위치 복원 검증/보강

### 트랙 B — 선택 최적화 (개정으로 축소, A를 막지 않음)
1. `totalCount` 필드 추가 (백엔드 협의) — "결과 N마리" 표시·필터 옵션별 개수용(SEO엔 불필요해짐)
2. (선택) offset 입력 추가 — 딥 페이지 `first: N×20` 슬라이스의 페이로드 최적화용
3. 필터 조합 noindex 여부 — **Search Console 실측 후** 확정("20마리만 색인"은 추정)
