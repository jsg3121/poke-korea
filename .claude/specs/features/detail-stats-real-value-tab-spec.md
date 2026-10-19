# 상세 능력치 탭(종족값 / Lv50 실수치) 기획서

> **작성일**: 2026-10-14
> **버전**: 1.62.0
> **상태**: 승인됨
> **범위**: 포켓몬 상세(`/detail/[pokemonId]` 기본·form·mega·region·gigantamax) "능력치" 섹션에 탭 추가. 별도 페이지와 입력형 계산기는 범위 밖이다.
> **렌더링**: 반응형 단일 뷰 ([ADR-0007](../../decisions/records/ADR-0007-responsive-rendering-strategy.md))
> **근거 문서**: [전략](../../research/strategy/2026-10-14-next-feature-priority.md) · [시장 조사](../../research/market/2026-10-14-next-feature-demand.md) · [경쟁력 분석](../../research/business/2026-10-14-next-feature-evaluation.md) · [트래픽 스냅샷](../../research/business/2026-10-14-traffic-snapshot.md)
> **관련 ADR**: [ADR-0011](../../decisions/records/ADR-0011-tab-touch-target-24px.md), [ADR-0020](../../decisions/records/ADR-0020-breakpoint-two-only.md), 작성 제안 ADR(8절)
> **지표 기준**: 트래픽 스냅샷(2026-10-14). `metrics-baseline.md`는 2026-05 기준이라 쓰지 않는다.

---

## 1. 배경 (Why)

### 1-1. 문제

- 상세 능력치 섹션은 종족값 막대 6개와 총합만 보여준다. 대전 유저가 알고 싶은 "이 포켓몬 스피드가 실제로 몇까지 나오는가"는 외부 도구(OP.GG·GameWith·pokical)로 나가서 계산해야 한다.
- 상세 기본 페이지는 전체 PV의 40.9%(254,427 / 621,425)이고, 랜딩 세션의 29.7%다. 재방문 PV 비중도 67.7%라 참조 도구처럼 반복 사용된다.
- 같은 이유로 능력치를 외부에서 계산하는 유저가 이탈하는 지점도 이 화면이다.

### 1-2. 왜 별도 페이지가 아니라 탭인가

- 단독 실수치 계산기는 OP.GG·GameWith·pokical에 후발이라 정면 경쟁이 된다(전략 문서 "제외한 후보").
- 상세 맥락에 붙이면 "포켓몬을 보다가 바로 확인"이라는 경쟁사에 없는 동선이 생긴다. 백엔드도 필요 없다(종족값이 이미 프론트에 있다).
- 입력이 없는 고정 표라서 구현 공수가 작다. 전략 1단계의 "작은 작업"이다.

### 1-3. 수요 근거의 한계

- 자사 검색 데이터는 약하다. "노력치/개체값/실수치" 계열 노출은 21회, "포켓몬 계산기"는 302회/9.0위다.
- 다만 이 수치는 해당 페이지가 없어서 노출이 적은 것이다. "수요 없음"으로 읽지 않는다(스냅샷의 해석 주의).
- 외부 수요는 시장 조사 문서의 간접 확인에 의존한다. 이 기능은 수요를 확정하는 기능이 아니라 **작게 시험하는 기능**이다. 그래서 성공 기준을 GA4 이벤트로 측정한다(6절).

---

## 2. 목표와 비목표

**목표**

1. 상세 능력치 섹션에서 Lv50 기준 실수치를 입력 없이 바로 확인한다.
2. 종족값과 실수치 정보를 모두 크롤러가 읽을 수 있는 DOM에 둔다.
3. 탭 전환 사용량을 GA4로 측정해 파티 점검·계산기 확장 여부의 근거로 쓴다.

**비목표**

- 개체값·노력치·성격을 고르는 입력 UI, 데미지 계산, 챔피언스 상세(`ChampionsDetailContent`)의 능력치 변경.
- URL 쿼리·경로로 탭을 구분하는 것(4-3).
- 상세 페이지 title/description 변경. 전략 원칙 4(같은 페이지의 UI와 메타를 2주 안에 같이 바꾸지 않는다)에 따라 효과 귀속을 분리한다.

---

## 3. 계산 규칙

### 3-1. 공식 (Lv50, 개체값 31 고정)

| 능력치 | 식 |
| --- | --- |
| HP | 종족값 + 75 + 투자분 |
| 그 외 5종 | floor((종족값 + 20 + 투자분) × 성격 보정) |

- 투자분은 본편 노력치 기준으로 `floor(floor(노력치 / 4) / 2)`이고, 챔피언스 능력 포인트로는 포인트 수와 같다. 노력치 252는 능력 포인트 32와 같은 결과다.
- 성격 보정은 상승 1.1, 중립 1.0, 하락 0.9다. HP에는 성격 보정이 없다.

**본편 공식과 일치함을 대수 전개로 확인했다.**

- 본편: `floor((2×종족값 + 개체값 + floor(노력치/4)) × 50/100) + 5`.
- 개체값 31, 노력치 0이면 `floor(종족값 + 15.5) + 5 = 종족값 + 20`이다.
- 노력치 252면 `floor(노력치/4) = 63`이고 `종족값 + 15.5 + 31.5 + 5 = 종족값 + 52`다. 이는 `종족값 + 20 + 32`와 같다.
- HP는 `+ 레벨 + 10`이라 무투자 `종족값 + 75`, 최대 `종족값 + 107`이다.

### 3-2. 소수점 처리

- 정수 연산(종족값 + 20 + 투자분)은 소수가 생기지 않는다. **내림은 성격 보정을 곱한 직후 한 번만** 적용한다.
- 예: 168 × 1.1 = 184.8이면 184로 표시한다. 반올림이나 올림은 쓰지 않는다.
- 이 규칙은 본편의 "성격 보정 후 소수점 이하 버림"과 일치한다.

### 3-3. 표시 열 선택지

| 안 | 열 | 장점 | 단점 |
| --- | --- | --- | --- |
| A (권고) | 무투자 / 최대 투자 / 최대 투자 + 상승 성격 | 본편·챔피언스 모두에서 도달 가능한 값만 담는다. 모바일에서도 3열이 넉넉하다 | 트릭룸용 최저 속도는 없다 |
| B | A + 최소(개체값 0, 무투자, 하락 성격) | 최저 속도 수요를 충족한다 | 챔피언스는 개체값이 31 고정이라 도달 불가능한 값이 섞인다. 열이 4개가 된다 |
| C | 최대 투자 + 상승 성격 하나만 | 가장 단순하다 | "무투자 시 얼마"를 알 수 없어 정보량이 부족하다 |
| D | A + 최대 투자 + 하락 성격 | 하락 성격 확인 가능 | 실사용 가치가 낮다 |

**결정(2026-10-15): A.** 레이아웃은 기존 종족값 카드(`StatBar`)에 맞춰 그린다. 행 높이·라벨 열 폭을 맞춰 탭을 바꿔도 카드 높이와 행 위치가 흔들리지 않게 한다(4-1). B는 수요 근거가 없어 보류하고, 필요해지면 열 추가만으로 확장한다.

**HP 행 (결정 2026-10-15)**: 성격 보정이 없어도 "최대 투자 + 상승 성격" 열에 **같은 값을 그대로 표시**하고, 옆에 안내 툴팁(ⓘ, "HP는 성격 보정을 받지 않아요")을 둔다. 툴팁은 키보드 포커스로도 열려야 하고, 스크린리더에는 같은 문구를 텍스트로 제공한다.

**열 머리글과 범례 (결정 2026-10-15)**: 표의 숫자는 본편과 챔피언스에서 같으므로 표는 하나로 둔다. 모바일 3열 폭을 지키기 위해 머리글은 짧게 두고, 게임별 의미는 표 아래 범례로 나눠 적는다.

```text
          무투자   최대 투자   최대+상승 성격
HP          183      215        215 ⓘ
공격        150      182        200
...
스피드      122      154        169

Lv50 · 개체값 31 기준
· 본편: 최대 투자 = 노력치 252
· 챔피언스: 최대 투자 = 능력 포인트 32
```

범례는 HTML 텍스트로 렌더해 "노력치 252", "능력 포인트 32" 표현이 크롤러에도 읽히게 한다.

### 3-4. 예시 (한카리아스: 종족값 108/130/95/80/85/102)

| 능력치 | 종족값 | 무투자 | 최대 투자 | 최대 + 상승 |
| --- | ---: | ---: | ---: | ---: |
| HP | 108 | 183 | 215 | 215 ⓘ |
| 공격 | 130 | 150 | 182 | 200 |
| 방어 | 95 | 115 | 147 | 161 |
| 특수공격 | 80 | 100 | 132 | 145 |
| 특수방어 | 85 | 105 | 137 | 150 |
| 스피드 | 102 | 122 | 154 | 169 |

- 종족값은 로컬 DB(`pokemon_stats`, 2026-10-14)와 대조해 일치를 확인했다. 구현 시 단위 테스트 기대값으로 쓴다.

### 3-5. 예외

- **껍질몬(Shedinja)**: 본편에서 HP가 항상 1이다. DB 종족값 HP도 1이다(2026-10-14 확인). 공식대로 계산하면 76이 나와 틀린다. **종족값 HP가 1이면 실수치 HP를 1로 고정**한다.
- **메가진화**: 폼별 `megaEvolutionStats`로 계산한다. 별도 처리는 없다.
- **거다이맥스**: 코드상 `pokemonBaseInfo.pokemonStats`를 그대로 쓴다. 다이맥스의 HP 배수는 적용하지 않는다.
- **용어 (2026-10-15 확인)**: 챔피언스 한국어판 게임 화면의 공식 표기는 **"능력 포인트"**(합계 66)이고, 성격 영역은 "능력 보정"이라는 제목 아래 성격 이름("고집" 등)이 표시된다. 본편은 "노력치"다. 표기 방식은 3-3의 범례를 따른다.

| 용어 | 뜻 | 본편 | 챔피언스 |
| --- | --- | --- | --- |
| 종족값 | 포켓몬 종류마다 정해진 기본 능력 | 같음 | 같음 |
| 개체값 | 개체마다 다른 숨은 능력(0~31) | 무작위, 아이템으로 31까지 | 31 고정 |
| 노력치 | 육성으로 쌓는 추가 능력 | 능력당 최대 252, 합계 510 | 없음 |
| 능력 포인트 | 노력치를 대신하는 챔피언스 시스템 | 없음 | 능력당 최대 32, 합계 66 |
| 성격 보정 | 능력 하나 +10%, 다른 하나 −10% | 같음 | 같음("능력 보정") |
| 실수치 | 위 요소를 모두 반영한 최종 값 | Lv50 기준 계산 | Lv50 고정 |

Lv50에서 노력치 8 ≈ 능력 포인트 1 ≈ 실수치 +1이라, 능력치별 최대값(이 표의 열)은 두 게임이 같다. 합계 예산(본편 510 → Lv50에서 32+32+1, 챔피언스 66 → 32+32+2)은 다르지만 능력치별 최대값을 보여주는 이 표와는 관계가 없다.

### 3-6. 공식 근거 링크

| 근거 | 내용 | 신뢰도 |
| --- | --- | --- |
| **챔피언스 게임 화면 역산 (2026-10-15, 사용자 제공 스크린샷)** | 능력 포인트 화면의 값 HP 168(포인트 2), 공격 198(26, 고집↑), 방어 115(0), 특수공격 108(0, 고집↓), 특수방어 120(0), 스피드 132(32)을 3-1 공식으로 역산하면 종족값 91/134/95/100/100/80 = **망나뇽**과 정확히 일치한다. HP(+75), 일반(+20), 성격 보정(×1.1·×0.9 후 내림), 포인트 1 = 실수치 +1이 모두 확인된다 | 실제 게임 값, 가장 높음 |
| [Smogon — Battle Mechanics at Level 50](https://www.smogon.com/dp/articles/mechanics_level50) | `HP = [BST + 0.5 IV + 0.125 EV + 60]`, `Stat = [(BST + 0.5 IV + 0.125 EV + 5) × NAT]`. 대괄호는 내림. 개체값 31, 노력치 252를 넣으면 3-1과 같은 결과다 | 직접 열람, 높음 |
| [Bulbapedia — Stat](https://bulbapedia.bulbagarden.net/wiki/Stat) | 3세대 이후 공식 `floor((floor((2×B + IV + floor(EV/4)) × L/100) + 5) × Nature)` | 열람은 403으로 실패하고 검색 결과 요약으로만 확인. 구현 전 직접 재확인 필요 |
| [Champdex — Stat Points](https://champdex.com/guides/stat-points) | 챔피언스는 레벨 50·개체값 31 고정. 능력 포인트 1이 최종 실수치 1이고 32가 노력치 252 상한에 대응 | 검색 결과 요약 기준, 2차 자료 |
| [Nintenderos — 챔피언스 능력치 공식](https://www.nintenderos.com/2026/04/asi-simplifica-las-formulas-de-las-estadisticas-pokemon-champions/) | `HP = 기본값 + 포인트 + 75`, 그 외 `(기본값 + 포인트 + 20) × 성격 보정` (Smogon 커뮤니티 분석 인용) | 2차 자료 |

**한계**

- 챔피언스 공식을 설명하는 문서는 커뮤니티 분석이지만, 게임 화면 역산(위 첫 행)으로 실제 값과 일치함을 확인했다. 경쟁력 분석 문서가 요구한 "OP.GG와 대조"는 이 확인으로 대신한다(C-1 완료).
- 본편 공식은 Smogon 문서와 대수 전개로 일치한다. Bulbapedia 직접 열람은 실패했다.

---

## 4. UX 요구사항

### 4-1. 구조

- 기존 "능력치" `SectionHeading` 아래 카드(`card-detail`) 안에 탭 2개를 둔다: **종족값**(기본, 현행 `StatBar`) / **Lv50 실수치**(신규 표).
- 같은 카드 안에서 탭만 전환한다. 광고 슬롯(`DetailStatsBanner`)이 카드 아래에 있으므로 두 패널 높이가 다르면 광고가 밀린다(CLS). 두 패널의 높이를 비슷하게 맞춘다. 종족값 패널은 총합 행 + 6행이고, 실수치 패널은 헤더 행 + 6행이다.
- 실수치 패널은 `<table>`을 쓰고, 열 헤더는 `scope="col"`이다. 기준과 게임별 의미는 표 아래 범례(3-3)로 둔다. 범례는 `aria-describedby` 등으로 표와 연결한다.

### 4-2. 두 패널 모두 DOM 렌더

- 두 패널을 항상 렌더하고 비활성 패널은 `hidden` 속성으로 숨긴다. 서버 렌더 HTML에 두 정보가 모두 들어간다.
- 주의: `hidden`은 `display:none`이다. Tailwind v3(이 저장소 `^3.4.17`) preflight의 `[hidden]` 규칙은 `.flex`·`.block` 같은 display 유틸과 우선순위가 같아 유틸이 이길 수 있다. **`hidden`을 단 요소에 display 클래스를 같이 붙이지 않고** 래퍼를 분리한다.
- **막대 애니메이션은 탭이 바뀔 때마다 재생한다(결정 2026-10-15).** 현재 `StatBar`의 카운트업은 `useEnterViewProgress`의 `IntersectionObserver`가 화면 진입 시 한 번 재생하는 구조라, 숨김 상태에서는 진행률이 0이고 재생 조건이 탭 전환과 연결돼 있지 않다. 탭이 "종족값"으로 바뀔 때마다 애니메이션을 처음부터 다시 시작하도록 재생 트리거를 연결한다(구현 방식은 `StatBar`를 쓰는 챔피언스 상세에 영향을 주지 않는 쪽으로 정한다, 5절).
- 숨겨진 패널의 수치도 HTML에 남는다. `StatBar`는 이미 `sr-only`로 실제 값을 함께 렌더하므로 SSR 값은 유지된다. 구현 후 `curl`로 서버 HTML에 두 패널의 값이 모두 있는지 확인한다.

### 4-3. URL 불변

- 탭 전환은 로컬 상태(`useState`)로만 처리한다. `router.replace`·`searchParams`·해시를 쓰지 않는다.
- 이유: 필터 변경(`router.replace`)이 GA4 향상된 측정의 history 기반 `page_view`를 발생시켜, 도감 목록 PV 84,727 중 `/list` 자체는 23,324뿐일 만큼 부풀려졌다(스냅샷 정정). 탭마다 `page_view`가 늘면 상세 PV 41%의 신뢰도가 흔들린다.
- 부작용: 탭 상태는 공유 링크로 재현되지 않는다. 의도된 한계다.
- **폼 이동(링크로 폼 전환) 시 탭은 "종족값"으로 초기화한다(결정 2026-10-15).** 저장소(localStorage)는 쓰지 않는다.

### 4-4. 접근성 (WAI-ARIA 탭 패턴)

근거: [WAI-ARIA APG — Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

- 탭 컨테이너 `role="tablist"` + `aria-label`(예: "능력치 보기 방식").
- 각 탭 `role="tab"`, `aria-selected`, `aria-controls`(패널 id), 고유 `id`.
- 각 패널 `role="tabpanel"`, `aria-labelledby`(탭 id).
- 키보드: 좌우 화살표로 탭 이동, Home/End, 선택된 탭만 `tabindex="0"`, 나머지 `-1`(roving tabindex). 패널이 미리 렌더돼 있으므로 포커스 시 즉시 활성화(자동 활성화)가 APG 권고와 맞는다.
- **현황 주의**: `TabItem`(`src/components/tab/TabItem.component.tsx`)의 버튼 분기는 `role="tab"`, `aria-selected`, `aria-controls`를 지원하지만 `tabIndex`·키보드 핸들러는 없다. `EvolutionConditionCard`의 버전 탭도 같은 방식이다. 키보드 화살표 이동을 `TabItem` 확장으로 넣을지 컨테이너에서 처리할지는 구조 결정이다(C-6, ADR 후보).
- 시각 선택 상태는 색에만 의존하지 않는다(밑줄 또는 채움으로 구분. `TabItem` 변형이 이미 해당).

### 4-5. 터치 타겟·반응형

- [ADR-0011](../../decisions/records/ADR-0011-tab-touch-target-24px.md)에 따라 `TabItem`을 그대로 쓰면 모바일 `min-h-9`(36px), 데스크톱 `min-h-touch`(44px)로 WCAG 2.2 AA(2.5.8, 24px)를 충족한다.
- [ADR-0020](../../decisions/records/ADR-0020-breakpoint-two-only.md)에 따라 브레이크포인트는 `mobile`·`desktop` 2종뿐이다. 표 열 폭이 좁은 구간에서 깨지면 구간을 쪼개지 말고 열 수나 폭을 조정한다. 3열 구성(A안)을 권하는 이유이기도 하다.
- 숫자 최소 글자 크기는 `text-2xs`(11px) 이상.

---

## 5. 적용 범위 — 폼 경로 확인

| 경로 | 조립 | 능력치 출처(`getActiveFormInfo`) |
| --- | --- | --- |
| `/detail/[id]` (기본) | `Detail.view.tsx` | `normalForm[0].normalFormStats` → 없으면 `pokemonBaseInfo.pokemonStats` |
| `/detail/[id]/form/[[...index]]` | 동일 | 동일 (`normalForm[0]`) |
| `/detail/[id]/mega/[[...index]]` | 동일 | `megaEvolutions[i].megaEvolutionStats` |
| `/detail/[id]/region/[[...index]]` | 동일 | `regionFormInfo[i].regionFormStats` → 없으면 기본 종 |
| `/detail/[id]/gigantamax/[[...index]]` | 동일 | `pokemonBaseInfo.pokemonStats` |

- 5개 `page.tsx`가 모두 `Detail.view.tsx` → `DetailStats.container.tsx`를 거친다. **컨테이너 한 곳 수정으로 모든 폼에 적용**된다.
- 주의 1: `form/[[...index]]`는 `activeIndex`가 있어도 `normalForm?.[0]`만 읽는다. 폼 인덱스가 있는 경로에서 올바른 수치인지 구현 중 확인한다. 현행 종족값과 같은 동작이라 이번 범위의 신규 결함은 아니다.
- 주의 2: `stats`가 없으면 섹션 전체가 `null`이다. 탭도 함께 사라지는 현행 동작을 유지한다.
- `StatBar`는 챔피언스 상세(`ChampionsDetailContent`)에서도 쓰이므로 **`StatBar` 자체는 수정하지 않고** 실수치 표를 별도 컴포넌트로 만든다.

---

## 6. GA4 이벤트 요구사항

현재 `src/`에는 커스텀 이벤트 유틸이 없다. `layout.tsx`의 인라인 gtag 초기화만 있다. 전송은 [`coding.md` "분석 이벤트 전송"](../../conventions/guides/coding.md) 규칙(`modules/`의 공통 유틸 + 이벤트 타입 정의)을 따른다.

| 항목 | 값 |
| --- | --- |
| 이벤트 이름 | **`stats_tab_status`** (확정 2026-10-19) |
| 파라미터 | `tab`(`base` / `real`), `form_type`(`default` / `mega` / `form` / `region` / `gigantamax`), **`pokemon_number`(도감 번호, 결정 2026-10-15)** |
| 발생 시점 | 사용자가 탭을 눌러 **활성 탭이 바뀔 때만**. 같은 탭 재클릭, 초기 렌더, 폼 이동에 따른 초기화는 제외 |
| 한도 | 파라미터 값은 100자, 이벤트당 파라미터는 25개까지([GA4 한도](https://support.google.com/analytics/answer/9267744)) |

- 이벤트 이름·파라미터 이름·값은 모두 소문자 스네이크 케이스로 쓴다. 이름에 페이지를 넣지 않는다(`page_location`이 자동으로 붙는다). 상성 계산기 이름 입력의 이벤트와 함께 확정했다(2026-10-19).
- `form_type`은 상성 계산기 `use_name_search`와 같은 값 집합을 쓴다. 상세 `form` 경로(폼체인지)를 위해 `form` 값을 더했다(5절 적용 범위).
- `pokemon_number`로 "어떤 포켓몬에서 실수치를 많이 보는가"를 본다. 맞춤 측정기준 등록 대상에 포함한다.
- GA4 보고서에서 파라미터로 나눠 보려면 콘솔에서 맞춤 측정기준 등록이 필요하다. 사용자가 직접 한다.
- 공통 전송 유틸의 위치·타입·이름 규칙은 기술 결정이다(8절).

**지표**

| 구분 | 지표 | 기준값 |
| --- | --- | --- |
| 성공 | 탭 전환 사용자 비율(`stats_tab_status` 사용자 / 상세 조회 사용자) | 측정 전. 출시 4주 후 베이스라인 |
| 성공 | `tab=real` 전환 후 재전환 비율 | 측정 전 |
| 가드레일 | 월 PV / 사용자 | 13.7 (2026-09), 13.0 이상 유지 |
| 가드레일 | 상세 기본 PV, 상세 광고 노출(`ad_impression`) | 상세 254,427 PV (28일) |
| 참고 | "종족값" 질의 CTR | 0.46% (노출 13,095) |

- 탭은 URL을 바꾸지 않으므로 PV에는 영향이 없다. 광고 PV 모델에서 위험이 작다.
- 목표 수치는 지금 정하지 않는다. 4주 베이스라인 후 설정한다.

---

## 7. SEO 근거 — 숨긴 콘텐츠의 색인

**공식 근거 (있음, 단 범위 한정)**

- Google Search Central 모바일 우선 색인 문서: "You can have a different design on mobile to maximize user experience (for example, moving content into accordions or tabs); just make sure that the content is equivalent to the desktop site, since indexing on your site comes from the mobile site." — [Mobile-first indexing best practices](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- Google Search Central 지연 로딩 문서: "Google Search does not interact with your page." 사용자 동작(스크롤·클릭)에 의존해 로드되는 콘텐츠는 보이지 않는다. — [Fix lazy-loaded website content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)

**해석과 한계**

- 첫 문서는 탭에 둔 콘텐츠가 모바일·데스크톱에서 동등하면 문제가 없다는 근거다. 두 번째 문서는 클릭해야 만들어지는 콘텐츠는 못 읽는다는 근거다. 종합하면 **"클릭 없이 이미 HTML에 있는 숨김 패널"이 안전한 설계**이고, 이번 안(4-2)이 이에 해당한다.
- **공식 문서가 `hidden` 속성이나 `display:none`을 명시적으로 언급하지는 않는다.** "탭으로 숨긴 콘텐츠도 동일 가중치로 색인된다"는 직접 문장은 Google 공식 문서에서 찾지 못했다. 그 취지의 담당자 발언(Gary Illyes, John Mueller)은 2차 보도로만 확인했고 원문 링크는 확보하지 못했다.
- 따라서 "색인된다"를 단정하지 않는다. 배포 후 Search Console URL 검사의 "렌더링된 HTML"에서 두 패널의 수치가 보이는지 확인한다(C-8).
- 상세 노출의 62.4%가 이름 단독 질의라 이 기능이 CTR에 주는 영향은 작을 것이다. SEO 기대 효과는 "종족값/스피드" 같은 의도 질의에 한정된다.

---

## 8. 기술 결정과 ADR 제안

| 결정 | 상태 |
| --- | --- |
| GA4 커스텀 이벤트 전송 방식 | **확정(2026-10-15)**: `modules/`의 공통 전송 유틸 + 이벤트 타입 정의. 규칙과 검토 후보·기각 사유는 [`coding.md` "분석 이벤트 전송"](../../conventions/guides/coding.md) 참조. ADR 대상이 아니다(코딩 규칙) |
| 탭 키보드 접근성 구현 위치 (보류 가능) | 미결. `TabItem` 확장 vs 컨테이너 처리 vs 전용 Tabs 조립 컴포넌트. 기존 `EvolutionConditionCard` 탭에도 영향을 주는 컴포넌트 구조 결정이라, 후보를 비교하게 되면 ADR 작성을 제안한다([decisions/index.md](../../decisions/index.md) 기준) |

- 계산 함수의 위치(`modules/` 순수 함수)와 단위 테스트 범위는 구현 규칙(`coding.md`)을 따른다.

---

## 9. 실행 계획

단계마다 확인을 받고, 한 번에 여러 파일을 수정하지 않는다. 확인 지점에서 멈추고 승인을 받는다.

| 단계 | 작업 | 산출 | 확인 지점 |
| --- | --- | --- | --- |
| 0 | 기획서 승인 (2026-10-15 완료) | 이 문서 | C-1·C-2·C-4·C-5·C-7 완료 |
| 1 | 이벤트 이름 확정(파라미터는 6절 확정, 전송 방식은 `coding.md`) | 이벤트 타입 정의 | 이벤트 이름 승인 (2026-10-19 완료) |
| 2 | 계산 함수·단위 테스트 설계 | 계산 모듈 | 3-4 한카리아스·3-6 망나뇽 게임 값·3-5 껍질몬 예외를 기대값으로 승인 |
| 3 | 탭·표·범례·HP 툴팁 UI 구현. UX는 ux-designer에 위임하고 기존 종족값 카드 캡처를 먼저 넘긴다 | 컨테이너·컴포넌트 | **C-6** 키보드 구현 위치, 모바일·데스크톱 직접 확인 |
| 4 | GA4 이벤트 연결 | 이벤트 | 콘솔 맞춤 측정기준 등록은 사용자 수행 |
| 5 | 검증 | `curl`로 서버 HTML에 두 패널 존재 확인, 5개 폼 경로 확인, 모바일 폭 레이아웃(사용자 직접 확인) | 사용자 승인 후 changelog 작성 |
| 6 | 배포 후 | Search Console URL 검사로 렌더링 HTML 확인 | **C-8** |

- 개발 서버는 사용자가 실행한다. 구현 후 Playwright 캡처로 자체 확인하지 않고 화면은 사용자가 직접 본다.
- 코드 변경이 완료되면 해당 버전(1.62.0)의 changelog를 작성한다.
- 큰 작업(상성 계산기 이름 입력)과 동시 진행은 가능하지만, 상세 페이지 title/meta 변경과는 2주 간격을 둔다.

---

## 10. 리스크

| 리스크 | 영향 | 완화 |
| --- | --- | --- |
| 챔피언스 공식이 커뮤니티 자료 기반 | 틀린 수치 노출 | 게임 화면 역산으로 확인 완료(3-6). 본편은 Smogon과 대수 전개로 일치 |
| 탭 전환마다 애니메이션 재생이 챔피언스 상세의 `StatBar`에 영향 | 다른 화면 동작 변경 | `StatBar` 사용처 전부 확인, 재생 트리거는 상세 능력치 탭에서만 연결 |
| 껍질몬 등 공식 예외 | 틀린 수치 | 3-5 예외 처리 |
| 수요 근거가 간접적 | 사용량 저조 | 이벤트로 측정, 4주 후 판단. 공수가 작아 손실 한정 |
| `hidden` 요소가 색인에 반영되지 않을 가능성 | SEO 효과 미미 | 7절 한계 명시, 배포 후 렌더링 HTML 확인 |
| 두 패널 높이 차이로 광고 위치 이동 | CLS | 4-1 높이 정렬 |
| `hidden`과 display 유틸 충돌 | 두 패널이 동시에 보임 | 4-2 래퍼 분리 |
| `TabItem`에 화살표 키 지원 없음 | 키보드 접근성 미흡 | C-6에서 결정 |

---

## 11. 확인 지점 요약

| ID | 질문 | 결정 / 상태 |
| --- | --- | --- |
| C-1 | 챔피언스·본편 공식 검증 | **완료(2026-10-15)**: 챔피언스 게임 화면 역산(망나뇽)으로 일치 확인 |
| C-2 | 열 구성, HP 행 표기, 용어 | **확정**: 3열(종족값 카드에 맞춤), HP는 같은 값 + 툴팁, 머리글은 짧게 + 게임별 범례(공식 용어 "능력 포인트") |
| C-4 | 막대 카운트업 재생 | **확정**: 탭이 바뀔 때마다 재생 |
| C-5 | 폼 이동 시 탭 상태 | **확정**: 종족값으로 초기화 |
| C-6 | 키보드 화살표 처리 위치 | 미결. 후보를 비교하게 되면 ADR 제안(컴포넌트 구조 결정) |
| C-7 | 이벤트에 도감 번호 포함 | **확정**: `pokemon_number` 포함 |
| C-8 | 배포 후 렌더링 HTML 확인 | 필수 |

---

## 12. Changelog

| 날짜 | 버전 | 내용 |
| --- | --- | --- |
| 2026-10-14 | 1.62.0 | 초안 작성, 상태 `검토 중`. 한카리아스 종족값·껍질몬 HP 1은 로컬 DB로 확인 |
| 2026-10-15 | 1.62.0 | GA4 이벤트 전송 방식 확정(공통 유틸 + 타입 정의, `coding.md`). ADR 제안 철회 |
| 2026-10-15 | 1.62.0 | 상태 `승인됨`. 3열 확정(종족값 카드에 맞춤), HP 같은 값 + 툴팁, 머리글 + 게임별 범례, 공식 용어 "능력 포인트" 확인, 게임 화면 역산으로 공식 검증(C-1), 탭 전환마다 애니메이션 재생, 폼 이동 시 초기화, 이벤트에 `pokemon_number` 포함 |
| 2026-10-19 | 1.62.0 | 이벤트 이름 `stats_tab_status` 확정. `form_type`에 `form` 추가(상성 계산기 이벤트와 값 집합 통일), 이벤트 값 스네이크 케이스 명시 |

---

## 참고 자료

- [Google — Mobile-first indexing best practices](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- [Google — Fix lazy-loaded website content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)
- [W3C — WAI-ARIA APG Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Smogon — Battle Mechanics at Level 50](https://www.smogon.com/dp/articles/mechanics_level50)
- [Bulbapedia — Stat](https://bulbapedia.bulbagarden.net/wiki/Stat) (직접 열람 실패)
- [Champdex — Stat Points](https://champdex.com/guides/stat-points)
- [Nintenderos — 챔피언스 능력치 공식](https://www.nintenderos.com/2026/04/asi-simplifica-las-formulas-de-las-estadisticas-pokemon-champions/)
- [GA4 — 이벤트 수집 한도](https://support.google.com/analytics/answer/9267744)
- [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
