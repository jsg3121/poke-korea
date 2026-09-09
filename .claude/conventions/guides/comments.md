# 주석 가이드

## 적용 범위

이 문서는 **`src/` 하위 코드 주석**에만 적용된다.

`.claude/` 하네스 문서(ADR, SPEC, 컨벤션 등)는 CLAUDE.md의 **Why-First 원칙**을 따르며 이 문서의 제약을 받지 않는다.

> **Why:** Why-First는 하네스 문서를 위한 원칙인데 코드 주석까지 확대 적용되면서 주석 비율이 14.6%까지 올라갔다(2026-09-08 측정, `src/components`·`src/container`·`src/views` 기준). 설계 근거는 ADR·SPEC·changelog가 이미 담당하므로 코드에 중복 기록할 이유가 없다. 두 영역의 적용 범위를 명시적으로 분리한다.

---

## 3원칙

### 1. What은 쓰지 않는다

코드가 스스로 말하는 내용을 주석으로 반복하지 않는다.

```tsx
// ❌ 코드를 그대로 옮겼을 뿐
{/* 대회명 */}
<h2>{tournament.name}</h2>

// ❌ 타입과 변수명에 이미 있다
// 폼 타입에 따른 표시 텍스트
const formLabel = FORM_LABELS[formType]

// ✅ 주석 없이 충분하다
<h2>{tournament.name}</h2>
```

### 2. Why만 쓴다 — 특히 "왜 이 방법이 아닌가"

남길 가치가 있는 건 선택의 이유, 그중에서도 **기각 사유**다. 대안이 더 나아 보이는데 쓰지 않았다면 그 이유가 없으면 다음 사람이 되돌린다.

```tsx
// ✅ 되돌림을 막는 정보
// 여백은 래퍼가 아닌 <ins>에 준다 — unfilled 시 AdSense가 <ins>에
// display:none을 걸어, 래퍼 패딩만 남으면 빈 공간이 된다.
```

### 3. 휘발성 맥락은 쓰지 않는다

**누가·언제·어느 리뷰에서** 결정했는지는 git blame과 changelog의 몫이다. 코드 주석에 중복 기록하면 시간이 지나며 어긋난다.

```tsx
// ❌ 결정 주체·시점·도구명
// 확대분은 py-0.5가 흡수한다(핫픽스 2026-07-20)
// 색 단독 의존 금지(사용자 결정, QA 라운드 1)
// ARIA 소유 구조 위반이라 div로 배치(Gemini)

// ✅ 결정 내용만 남긴다
// 확대분은 py-0.5가 흡수해 클리핑되지 않는다
// radiogroup은 radio만 소유할 수 있어 ul/li 없이 배치한다
```

금지 대상: 날짜, 리뷰 도구명(Gemini 등), "사용자 결정/확정/요청", "QA 라운드", "핫픽스", "선례", ADR·SPEC·UX 문서 번호 참조.

> **Why:** ADR 참조(`ADR-0007` 등)를 코드에 박으면 문서가 이동·통합·폐기될 때 주석만 남아 끊긴 링크가 된다. 어떤 결정이 왜 내려졌는지는 `.claude/decisions/`에서 찾고, 코드에는 결정의 **결과**만 둔다.

---

## 형식

### 기본은 JSDoc/TSDoc

컴포넌트·함수 설명은 `/** */`로 쓴다. 요약 1~3줄이 기본이고, 더 필요하면 `@remarks`에 불릿으로 붙인다.

```tsx
/**
 * 디자인 시스템 타입 태그.
 *
 * @remarks
 * - 정렬은 flex가 아니라 block+line-height(height+2px) — Gmarket Sans는
 *   글자가 line-box 위로 치우쳐 flex 중앙보다 시각적으로 정확하다.
 * - 색상은 정적 매핑 — 동적 클래스(`bg-type-${x}`)는 Tailwind purge에 누락된다.
 */
```

산문 블록 대신 TSDoc을 쓰는 실익이 하나 더 있다. VSCode가 JSDoc을 툴팁으로 렌더하므로 **호출부에서 바로 읽힌다.** 파일 상단의 긴 산문은 툴팁에서 잘려 나온다.

주요 태그: `@param`, `@returns`, `@remarks`, `@example`, `@deprecated`

> **근거:** [TSDoc](https://tsdoc.org/)은 TypeScript 문서 주석 표준이며 `@remarks`는 요약과 상세를 분리하는 표준 태그다. [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html#comments-documentation) 역시 주석은 "왜"에 집중하고 "무엇"은 코드로 표현하라고 규정한다.

### 실측 수치는 쓰지 않는다

측정값은 시간이 지나면 틀려지고 검증할 방법도 없다.

```tsx
// ❌ 검증 불가능한 수치
// PC 인아티클 채움률 88% vs 고정 규격 42%
// 프로덕션 8회 실측 280px 고정(편차 0)
// 모바일 슬롯 채움률 58~62%
```

필요하면 changelog나 `.claude/research/reports/`에 남긴다.

### 외부 시스템의 동작 제약은 1줄로 남긴다

수치와 달리, **브라우저·외부 API가 강제하는 동작**은 코드로 표현할 수 없고 모르면 재현 비용이 크다. 이유만 간결히 남긴다.

```tsx
// ✅ 외부 동작 제약 (1줄)
// to-transparent은 Safari에서 회색 잔상 — 동색 투명으로 보간해야 한다
// overflow-x만 auto면 명세상 overflow-y도 auto로 계산돼 세로 스크롤이 잡힌다
```

수치·측정 횟수·비교 대상은 빼고 **제약 자체만** 쓴다.

### 인라인 `//`은 예외적으로만

다음 두 경우에만 허용한다.

1. **도구 억제 + 사유** — `eslint-disable`, `@ts-expect-error` 등
2. **의도적 규칙 위반·우회책** — 프로젝트 정책이나 표준을 어쩔 수 없이 따르지 못하는 경우

```tsx
// ✅ 억제 사유
// eslint-disable-next-line react-hooks/exhaustive-deps
// ↑ debounce된 keyword 변경 시에만 실행하는 것이 의도

// ✅ 우회책
// useLayoutEffect는 SSR에서 경고를 내므로 서버에선 useEffect로 대체한다

// ❌ 그 외 전부 — JSDoc으로 올리거나 삭제
// 멤버 이름 폴백
// 자동 로드 sentinel
```

빈 주석 줄(`//`만 있는 줄)은 문단 구분용이라도 쓰지 않는다.

---

## 요약

| 대상 | 처리 |
|------|------|
| 코드가 말하는 내용 | 쓰지 않음 |
| 선택 이유·기각 사유 | JSDoc `@remarks` |
| 결정 주체·날짜·리뷰 도구 | 쓰지 않음 (git blame) |
| ADR·SPEC·UX 문서 번호 | 쓰지 않음 (`.claude/`에서 조회) |
| 실측 수치 | 쓰지 않음 (changelog·research) |
| 외부 시스템 동작 제약 | 1줄, 수치 없이 |
| 인라인 `//` | 도구 억제 사유 / 의도적 우회책만 |
