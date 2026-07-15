# UX-006: 포켓몬 상세 습득 기술 페이지(/detail/[pokemonId]/moves) 반응형 단일 뷰 개편 (트랙 B)

- 작성일: 2026-07-12
- 에이전트: ux-designer
- 입력: [UX-005](UX-005-detail-redesign.md) + [RES-003](RES-003-detail-page-reference.md) + 현행 `/detail/[id]/moves` 코드(views/container desktop·mobile) + 실화면 캡처(2026-07-12 프로덕션, 피카츄 #25) + DS 인벤토리(MoveTable)
- 범위: 설계만(코드 미작성). 반응형 단일(ADR-0007)·모바일 퍼스트·DS 재사용 전제. 상세 본체 개편(UX-005, PR #181)의 후속 트랙 B. 크롬만 UA 허용, 광고 배치 잠정 제외
- 관련: 상세 개편 보류 트랙 B(moves 6라우트). canonical 통합은 2단계 SEO 트랙에서 seo-specialist 협의로 분리

---

## 0. 실캡처로 확인한 신규 Critical 결함 (마이그레이션 QA 필수 항목)

기존 UX-005 M3(대형 여백)에 더해, 이번 조사에서 문서화되지 않은 Critical급 결함을 실캡처로 확인했다.

**[Critical] 모바일 기술 카드 설명 텍스트가 글자 단위로 세로로 깨져 판독 불가**

- 문제: `04-detail-moves-mobile.png`(피카츄, 프로덕션)에서 각 기술 카드의 설명 문구가 1~2글자씩 세로로 쌓여 사실상 읽을 수 없다. 전체 기술 카드 15개 전부에서 재현.
- 원인(코드 확인, `MoveCard.component.tsx`): `dl`이 `flex flex-wrap`이고 타입/위력/명중률/PP `dt`·`dd`가 각각 퍼센트 고정 폭(`w-[9%]`~`w-[18%]`)으로 나열된다. 설명 `dd`만 `w-full`로 오버라이드하지만, flex item의 기본 `min-width:auto` 특성상 좁은 flex 트랙 안에서 콘텐츠 폭이 축소되며 강제 줄바꿈이 문자 단위로 무너진다. word-break 제어가 전혀 없다.
- 근거: WCAG 1.4.10(Reflow) — 텍스트가 읽을 수 없는 상태는 콘텐츠 손실이며 사용 불가 등급.
- 개선안: `MoveCard`/`MoveDetailCard`(dl+퍼센트폭 flex-wrap 구조)를 폐기하고 MoveTable DS로 전면 교체(§3·§5). MoveTable은 이미 `min-w-0 flex-1 break-keep`으로 이 문제를 원천 차단하는 구조로 검증됨(DetailSkills 조립 사례).

이 결함은 이번 개편으로 자동 해소되지만, 회귀 즉시 감지를 위해 **마이그레이션 QA 체크리스트에 별도 항목으로 포함**한다.

---

## 1. 데스크톱/모바일 콘텐츠 차이 확인 — 결론: 단일 뷰 통합 가능

`MovesHeader.container.tsx`(desktop) vs (mobile), `MovesTableContainer.tsx`(desktop) vs (mobile) 대조 결과:

| 항목 | desktop | mobile | 차이 성격 |
|---|---|---|---|
| 헤더 정보(이미지+이름+타입+최초/최신버전+이전/다음폼+일반/리전폼 링크) | 동일 필드 | 동일 필드 | 레이아웃 크기만 차이, 데이터 100% 동일 |
| 버전 그룹 가로 스크롤 nav | 동일 로직(`versionListRef`+`scrollIntoView`) | 동일 | 완전 동일 |
| 기술 목록 헤더(제목+토글) | `border-b` 고정 헤더 | `sticky top-12` 고정 헤더 | 모바일만 sticky — 임시방편 추정, 구조 차이 아님 |
| 기술 카드 | `MoveDetailCard`(가로 배치, `h-32`) | `MoveCard`(dl 세로 스택) | 컴포넌트 자체 상이(§0 원인), 표시 데이터는 동일 |

데이터 모델·인터랙션 로직은 100% 동일하며 차이는 순수 시각 표현뿐 → 상세 본체(트랙 A) MoveTable이 증명한 패턴과 동일 성격, 반응형 단일화 대상.

---

## 2. 반응형 단일 뷰 레이아웃 구조

### 섹션 순서 (본체 트랙 A와 톤 통일)

```text
전역 헤더(크롬, 호출부 책임)
 ├─ [상세로 돌아가기] 링크 (기존 "OO의 상세 정보 보러가기" 승계)
 ├─ moves 전용 미니 히어로
 │   ├─ 이미지 + No.번호 + 이름 + 타입 칩
 │   ├─ 최초/최신 등장 버전
 │   └─ 폼 인덱스 슬라이드 (◀ n/N ▶) — 노말폼/리전폼 다중 대응 (DetailHero 패턴)
 │   └─ [일반폼 보기 / 리전폼 보기] 전환 링크
 ├─ [광고 슬롯 — 이번 트랙에서 제거]
 ├─ 버전 그룹 가로 스크롤 nav (필터 헤더, §4)
 ├─ 습득 기술 (MoveTable DS, 레벨업/머신 — §3)
 └─ 전역 푸터(+모바일 탭바, 크롬)
```

moves는 독립 페이지이므로 식별 정보는 축소된 요약 히어로로 충분하다(본체처럼 풀사이즈 그라데이션 히어로 불필요 — "상세로 돌아가기" 링크로 컨텍스트가 있고, 이 페이지의 주 목적은 기술 목록 자체).

### 컴포넌트 계층

```text
DetailMovesView (신규, views/detail/ — 본체 Detail.view.tsx 동형)
 ├─ MovesSummaryHeaderContainer (신규, 요약 히어로 — 기존 MovesHeader 대체)
 ├─ MovesVersionNavContainer (신규/로직 이관 — 버전 그룹 가로 스크롤)
 └─ MovesListContainer (신규 — DetailSkills 조립 패턴 재사용)
     └─ MoveTableComponent (기존 DS 재사용) × 1~2
```

---

## 3. 레벨업/머신 전환 인터랙션 최종안

### 결정: 토글 폐기 → 레벨업/머신 동시 노출. `/machine` URL은 스크롤 앵커로 의미 승계

| 근거 | 설명 |
|---|---|
| RES-003 권고1 준수 | "단일 세로 스크롤 유지, 탭/토글 분할 금지"가 개편 전체 공통 원칙(UX-005). moves만 예외 근거 없음 |
| 데이터 규모가 토글 정당화 못함 | 컴팩트 MoveTable 행이면 두 목록 연결해도 부담 적음. 토글의 "숨김" 이점 미미 |
| 본체와 인터랙션 일관성 | 본체 DetailSkills가 "동시 노출 + 미리보기 + 전체보기 링크"로 검증. moves는 그 전체보기 도착지인데 재분할하면 일관성 위반 |
| 토글 자체의 사용성 비용 | 미선택 데이터를 숨겨 비교 사용자가 매번 전환해야 함 |

### `/machine` URL 처리

URL 삭제 안 함(SEO·공유 자산). 딥링크 스크롤 앵커로 전환:

```text
/detail/[id]/moves         → 진입 시 최상단(레벨업부터)
/detail/[id]/moves/machine → 진입 시 머신 섹션(#machine-skills) 자동 스크롤
```

- CSS 네이티브 앵커(`<a href="#machine-skills">` + `scroll-margin-top` 고정헤더 오프셋)를 우선, `scrollIntoView`는 progressive enhancement
- 접근성: 머신 섹션에 `tabIndex={-1}` + 포커스 이동(WCAG 2.4.3)
- **canonical 통합은 이번 트랙에서 확정하지 않음** — seo-specialist 협의로 2단계 SEO에서 분리(RES-003 권고4 경계). 기존 `/machine` 전용 메타가 독자 검색 수요를 노렸다면 통합이 자산 손실일 수 있음
- 버전 그룹(`/version/[id]`)은 데이터가 실제로 달라지므로 스크롤 앵커가 아니라 데이터 재조회 유지 — URL·페칭 변경 없음, 뷰만 교체

---

## 4. 필터 헤더 반응형 전략

구버전 `MovesHeader.container.tsx`의 3기능을 본체 패턴에 맞춰 분리한다.

- **① 요약 정보**: 이미지 모바일 축소(`h-24 w-24`), No.·이름·타입 칩 `text-base`(ADR-0012) 단일 토큰, 등장 버전 `dl` 시맨틱(모바일 세로 → `desktop:flex-row`)
- **② 폼 전환**: 노말폼 다중은 DetailHero 슬라이드(◀ n/N ▶) 이식(UX-005 §7-5 확정 결정 승계), 리전폼은 DetailFormRow 칩 링크 재사용 → 신규 컴포넌트 불필요
- **③ 버전 그룹 선택**: 구버전 로직(`versionListRef`+`scrollIntoView`+`activeGroupId`) 그대로 이관(desktop/mobile 동일). 터치 타겟은 스타일 가이드 `min-h-9 desktop:min-h-touch` 기준 재검토. `sticky top-12`는 페이지 짧아지므로 유지 필요성 낮음(실사용 스크롤 길이 확인 후 결정)

---

## 5. MoveTable DS 재사용 여부 — 결론: 재사용 충분, `skillId?` 옵션 1개만 추가

**재사용 근거:**
1. 열 구성 완전 일치: 구버전 카드 필드(습득조건/기술명/타입/분류/위력/명중/PP)가 `MoveTableItem`과 1:1
2. 조건 라벨 지원: `condition: string`이 "Lv.12"/"진화"/"머신" 문자열 수용 — DetailSkills가 검증
3. 버전별 차이는 데이터 페칭 책임: 버전 바꾸면 다른 스킬 배열 반환할 뿐 `moves: MoveTableItem[]` 형태 동일, 열 확장 불필요
4. 설명 필드: MoveTable은 설명을 의도적으로 제외(행당 ~64px). moves에서 설명 필요 시 "기술 상세보기" 링크로 유도

**유일한 확장: 행 클릭 가능성**

moves 페이지는 각 기술 상세(`/moves/{skillId}`)로 가는 개별 링크가 필요(구버전에도 있던 기능, 상실 시 회귀). `MoveTableItem`에 `skillId?: number`(옵셔널) 추가 → 존재 시 `<li>`를 `<Link>`로 승격. DetailSkills 등 기존 호출부는 옵셔널이라 영향 없음(하위 호환). **신규 DS가 아니라 기존 MoveTable 소규모 옵션 추가.**

---

## 6. 재사용/신규 컴포넌트 목록

| 구분 | 컴포넌트 | 처리 |
|---|---|---|
| 재사용(확장) | `MoveTableComponent` | `skillId?` 옵션 추가 후 사용 |
| 재사용(패턴 이식) | DetailHero 폼 슬라이드, DetailFormRow 폼 칩 | moves 히어로/전환에 적용 |
| 재사용(로직 이관) | 버전 그룹 가로 스크롤 nav | desktop 로직 그대로 단일 컴포넌트로 |
| 재사용(로직) | `movesParams.module`(파싱/빌더), Tag/Chip/LinkButton DS | 변경 없음 |
| 신규(뷰) | `DetailMovesView` | Detail.view.tsx 동형 |
| 신규(컨테이너) | `MovesSummaryHeaderContainer` | 구버전 헤더 2벌 대체 |
| 신규(컨테이너) | `MovesListContainer` | 구버전 테이블 2벌 대체, DetailSkills 패턴(토글 없이 순차 배치 + `/machine` 앵커) |
| 폐기 | `MoveCard`, `MoveDetailCard` | §0 Critical 근원, MoveTable로 대체(detail.moves 전용 확인 완료) |
| 폐기 | `Toggle.component`(moves 전용) | §3 결정, moves 외 미사용 확인 완료 |
| 폐기(UA 분기) | `views/{desktop,mobile}/detail/detail.moves/**`, `container/{desktop,mobile}/detail/detail.moves/**` | 반응형 단일화 |
| 데이터 모델 유지 | `DetailMoves.context` | 필드 유지. `currentMovesType` 의미가 "배타 토글"→"스크롤 앵커 타겟"으로 바뀜(주석 갱신) |
| 보존(C그룹 자산) | `MoveListCard.component` | `/moves` 목록 페이지가 사용 — A그룹에서 건드리지 않음 |

광고 슬롯(`DesktopDetailMovesBanner`)은 본체 트랙과 동일하게 이번 개편에서 제거, 반응형 광고 유닛 도입 시 재검토.

---

## 7. 리스크·엣지케이스

| 케이스 | 대응 |
|---|---|
| 폼 없는 포켓몬 | `formDataLength > 1 \|\| isFormChange` 조건부 렌더. `/moves/form/*`는 서버 가드(`permanentRedirect`)로 폼 존재 보장 — 유지 |
| 버전 미지원(스킬 0개) | 섹션 렌더 스킵 + "이 버전에서는 습득 가능한 기술이 없습니다" 빈 상태 메시지(MoveTable에 empty-state 없음, 추가 권고) |
| 리전폼+노말폼 다중 동시 | `activeType`이 `'region'\|'normalForm'` 배타 상태라 동시 노출 안 됨(구버전 로직 승계) |
| `/machine` 딥링크 JS 비활성 | CSS 네이티브 앵커 우선(`scroll-margin-top`), `scrollIntoView`는 향상 기능으로만 |
| 버전 그룹 많은 포켓몬 | 활성 항목 `scrollIntoView(inline:'start')` 유지 + 페이드/화살표 단서(RES-003) |
| `/machine` canonical 통합 시 색인 URL | 2단계 SEO에서 seo-specialist 협의로 확정(이번 트랙 미확정) |

---

## 요약 — 트랙 B 핵심 결정 3가지

1. **레벨업/머신 = 토글 폐기, 동시 노출**. `/machine` URL은 스크롤 앵커로 의미 전환(URL 보존, canonical은 SEO 협의)
2. **MoveTable DS 재사용 + `skillId?` 옵션 1개 추가**로 충분, 신규 DS 불필요
3. **MoveCard/MoveDetailCard 폐기**가 §0 Critical 결함 회복의 최우선 근거 (detail.moves 전용, 회귀 없음 확인)
