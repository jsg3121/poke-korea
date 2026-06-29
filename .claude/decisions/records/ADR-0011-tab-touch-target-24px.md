# ADR-0011: 슬림 인터랙티브(탭·칩) 터치 타겟 24px 허용 (데스크톱 44px 유지, WCAG 2.2 AA, 간격 24px 전제)

- **상태**: 승인
- **날짜**: 2026-06-25 (2026-06-28 칩 확장 · 2026-06-29 입력 컨트롤 데스크톱 컴팩트 확장)
- **담당**: jsg3121 + Claude

## 맥락

[styling.md](../../conventions/guides/styling.md)의 터치 타겟 규칙은 **"인터랙티브 요소는
최소 44px(`min-h-touch`)"** 였다. 근거는 [WCAG 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)와
Apple HIG(44pt)였다.

DS 원자 `TabItem`(밑줄형/채움형 탭 항목)을 구축하면서, 이 44px이 **탭에는 과하다**는
문제가 드러났다. 특히 채움형(`fill`)은 배경이 꽉 차는 알약이라 높이 44px이면 모바일에서
시각적 부피가 크고, 모바일 탭/서브네비는 통상 슬림하다(iOS·Material의 상단 탭 모두 본문
콘텐츠보다 낮은 높이). 밑줄형도 텍스트+밑줄만 있는데 44px 높이를 강제할 이유가 약하다.

즉 "버튼·CTA"에 맞춰 정한 44px을 "탭"에 그대로 적용하는 것이 과했다. 그러나 44px은
styling.md에 명시된 프로젝트 규칙이므로, 이를 완화하려면 합의와 기록이 필요하다.

이후 DS 원자 `Chip`(데미지 유형·세대 칩)을 구축하면서 같은 문제가 반복됐다. 칩도 작은
라벨이라 슬림한 게 관용적이고(기존 필터 칩이 `h-7` 28px), 44px은 과하다. 따라서 이 ADR의
"슬림 인터랙티브 24px" 결정을 칩까지 확장했다(2026-06-28).

## 결정

**탭 항목에 한해, 그리고 모바일에서만** 최소 터치 타겟을 **24px**(`min-h-touch-tab`)까지
허용한다. **데스크톱은 기존 44px(`min-h-touch`)을 유지**한다. 근거는
[WCAG 2.2 — 2.5.8 Target Size (Minimum, AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)의
24×24 CSS px 기준이다.

1. `tailwind.config.js` spacing에 `touch-tab: 1.5rem`(24px) 토큰을 추가한다.
2. `TabItem`의 공통 베이스 높이를 모바일 퍼스트로 차등한다:
   `min-h-touch-tab desktop:min-h-touch` — base(모바일) 24px, 데스크톱 44px.
3. **전제 조건(모바일)**: WCAG 2.5.8은 타겟이 24px 미만이거나 작을 때 **"타겟 중심 간
   간격 24px 이상"** 이면 통과하는 spacing 예외를 둔다. 따라서 `TabItem`을 배열로 조립하는
   상위(네비 바·컨텐츠 탭)는 **모바일에서 항목 간 간격(gap)을 24px 이상** 확보해야 한다.
   데스크톱은 44px이라 이 전제가 불필요하다.
4. **적용 범위는 슬림 인터랙티브(탭·칩) + 입력 컨트롤/아이콘 버튼의 데스크톱 컴팩트**로
   한정한다. 텍스트 CTA(Button)의 44px(`min-h-touch`) 규칙은 그대로 유지한다.
   - **탭(`TabItem`)**: 모바일 24px, 데스크톱 44px(`min-h-touch-tab desktop:min-h-touch`).
   - **칩(`Chip`)**: clickable일 때 24px(`h-7` 28px, 24px 이상이며 슬림). 칩은 모바일·
     데스크톱 모두 슬림한 게 관용적이라 데스크톱도 키우지 않는다. clickable이 아닌 표시
     전용 칩은 애초에 터치타겟 대상이 아니다.
   - **입력 컨트롤(`SelectInput`)·아이콘 버튼(`CloseIconButton`)**: 모바일은 손가락 터치라
     44px(`min-h-touch`) 유지, 데스크톱은 마우스 정밀도가 높아 36px(`desktop:min-h-9`)로
     컴팩트하게. 24px 슬림 예외와 달리 모바일 44px은 지키되 데스크톱만 줄인다.
     (`SearchInput`은 입력량이 많아 디바이스 무관 44px 유지.)
5. styling.md 터치 타겟 규칙에 이 예외(탭·칩·입력 컨트롤 데스크톱 컴팩트)를 명시한다.

## 근거

- **44px은 AA 최소가 아니다**: 자주 인용되는 "44px"은 WCAG 2.5.5로 **AAA(최고 등급)**
  이다. 법적·실무 최소선인 **AA는 WCAG 2.2의 2.5.8로 24px**이다. 탭을 24px로 두어도
  접근성 표준(AA)을 충족한다.
- **탭의 관용적 형태(모바일)**: 모바일 상단 탭/서브네비는 본문보다 슬림한 것이 일반적이다
  (iOS HIG·Material 모두 상단 탭은 낮은 높이). 모바일에서 44px 강제는 시각적으로 과하다.
  반면 데스크톱은 포인터(마우스) 정밀도가 높고 화면이 넓어 44px이 부담되지 않으므로 유지한다.
- **칩의 관용적 형태**: 칩(데미지 유형·세대 필터 등)은 작은 라벨이라 본질적으로 슬림하다.
  기존 필터 칩들도 `h-7`(28px)이었다. 탭과 달리 칩은 데스크톱에서도 슬림한 게 자연스러워
  디바이스 차등 없이 28px로 둔다(여전히 AA 24px 이상). 같은 "슬림 인터랙티브 24px" 결정의
  연장이다.
- **spacing 예외로 오탭 방지**: 24px로 줄이는 대신 항목 간격 24px을 강제하므로, 손가락
  오탭(인접 항목 잘못 누름) 리스크를 표준이 정한 방식으로 보완한다.
- **영향 범위 최소화**: 전체 규칙을 내리지 않고 탭 전용 토큰을 신설해, 버튼 등 다른
  요소의 44px은 보존한다. 회귀 위험이 작다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| 44px 유지(현행) | 단순, AAA 충족 | 모바일 탭에 과한 부피, 슬림 탭 불가 | 모바일 탭 형태에 부적합 |
| 모바일만 24px + 데스크톱 44px + 간격 24px (채택) | AA 충족, 영향 최소, 디바이스별 적합 | 상위 조립이 모바일 간격 책임 짐 | — |
| 탭 전체(모바일·데스크톱) 24px | 단순 | 데스크톱까지 슬림해질 필요 없음 | 데스크톱은 44px이 적합 |
| 프로젝트 전체를 24px로 완화 | 일관 | 버튼 등까지 영향, 회귀 위험 큼 | 범위 과대, 리스크 |

## 결과

- `tailwind.config.js`에 `touch-tab`(24px) 토큰 추가.
- `TabItem`(`tabItemStyle.ts`) 베이스 높이가 `min-h-touch-tab desktop:min-h-touch`가
  된다 — 모바일 24px, 데스크톱 44px. 채움형 알약이 모바일에서 덜 부해 보인다.
- **상위 조립 컴포넌트(네비 바·컨텐츠 탭)는 모바일에서 항목 간격을 24px 이상 두어야
  한다** — 이 전제가 깨지면 모바일에서 WCAG 2.5.8 spacing 예외를 만족하지 못한다. 조립
  단계에서 반드시 확인. 데스크톱은 44px이라 무관.
- `Chip`(clickable) 높이는 `h-7`(28px). 칩을 그룹(필터)으로 배치하는 상위는 **항목 간격을
  24px 이상** 두어야 한다(28px이 44px 미만이므로 spacing 예외 적용). 표시 전용 칩은 무관.
- `SelectInput`·`CloseIconButton`은 `min-h-touch desktop:min-h-9`(모바일 44px / 데스크톱
  36px). 모바일 터치는 지키고 데스크톱만 컴팩트. `SearchInput`은 44px 고정.
- styling.md 터치 타겟 규칙에 슬림 인터랙티브(탭·칩) + 입력 컨트롤 데스크톱 컴팩트 예외가
  명시됐다.
- 데스크톱 탭, 그리고 텍스트 CTA(Button) 등 나머지 요소의 44px 규칙은 변경 없음.

## 참고 자료

- [WCAG 2.2 — 2.5.8 Target Size (Minimum, AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.1 — 2.5.5 Target Size (Enhanced, AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Apple HIG — Layout (touch target 44pt)](https://developer.apple.com/design/human-interface-guidelines/layout)
- [styling.md — 터치 타겟 규칙](../../conventions/guides/styling.md)
- [ADR-0010 원자 우선 DS 구축](./ADR-0010-atomic-first-ds-build-order.md)
