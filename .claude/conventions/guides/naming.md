# 네이밍 가이드

**어떤 이름을 붙이는가**를 규정한다. 파일명뿐 아니라 컴포넌트·함수·훅·타입·상수에 모두 적용된다.

관련 문서 — 폴더 배치는 `structure.md`, 계층 책임과 작성 규칙은 `coding.md`.

---

## 원칙: 이름은 한 번만 말한다

같은 정보를 파일명·컴포넌트명·타입명에 반복하지 않는다. 위치가 이미 말하는 것을 이름이 되풀이하면 길기만 하고 정보가 늘지 않는다.

```tsx
// ❌ Component가 세 번
// components/tag/Tag.component.tsx
interface TagComponentProps { ... }
const TagComponent = ({ ... }: TagComponentProps) => { ... }

// ✅ 파일명이 계층을 말하므로 이름은 대상만
// components/tag/Tag.component.tsx
interface TagProps { ... }
const Tag = ({ ... }: TagProps) => { ... }
```

---

## 파일명

| 유형      | 패턴                 | 예시                    |
| --------- | -------------------- | ----------------------- |
| 컴포넌트  | `이름.component.tsx` | `Tag.component.tsx`     |
| 컨테이너  | `이름.container.tsx` | `Footer.container.tsx`  |
| 뷰        | `이름.view.tsx`      | `List.view.tsx`         |
| 컨텍스트  | `이름.context.tsx`   | `Device.context.tsx`    |
| 커스텀 훅 | `use이름.ts`         | `useDebounce.ts`        |
| 타입 정의 | `이름.types.ts`      | `pokemonTypes.types.ts` |
| 모듈      | `이름.module.ts`     | `activeForm.module.ts`  |
| 유틸      | `이름.util.ts`       | `skill.util.ts`         |
| 스토리    | `이름.stories.tsx`   | `Tag.stories.tsx`       |

### 접미사는 계층을 나타낸다

파일명 접미사는 **그 파일이 어떤 계층인지**를 말한다. `modules`·`utils`는 전역 폴더에도, 도메인 하위에도 존재할 수 있으므로(`containers/detail/modules/`) 접미사로 성격을 드러낸다.

```text
modules/apolloClient.module.ts              # 전역
containers/detail/modules/activeForm.module.ts   # detail 도메인 로컬
```

`.organism`은 쓰지 않는다. Atomic Design의 원자/유기체 구분은 판정 기준이 모호하고(`FilterBar`는 organism인데 `MoveTable`은 component인 이유를 설명할 수 없다), `structure.md`의 폴더 체계에도 그 층이 없어 두 체계가 섞인다. [ADR-0010](../../decisions/records/ADR-0010-atomic-first-ds-build-order.md)은 **빌드 순서**에 관한 결정이지 파일명 규칙이 아니다.

스타일 정의만 담는 파일은 접미사 없이 `camelCase`를 쓴다(`chipStyle.ts`, `buttonStyle.ts`) — 계층이 아니라 그 컴포넌트의 부속이다.

### 예외를 두지 않는다

폴더 단위로 접미사를 생략하지 않는다. `adSlot/`·`views/quiz/`처럼 관행으로 굳은 곳도 규칙을 따른다.

> **Why:** 예외를 인정하면 "어디까지가 예외인가"를 매번 판단해야 한다. 실제로 `containers/` 안에 `.component.tsx`가 섞여 있는 등 경계가 이미 흐려진 상태다.

---

## 컴포넌트

**PascalCase, 접미사 없이 대상만 쓴다.**

```tsx
// components/champions/ChampionsCard.component.tsx
const ChampionsCard = () => { ... }
export default ChampionsCard
```

파일명과 컴포넌트명은 **같은 어간**을 쓴다. `Tag.component.tsx` → `Tag`.

도메인 컴포넌트는 도메인명을 접두로 둔다(`ChampionsCard`, `DetailHero`). 폴더가 이미 말하지만, import 후에는 폴더가 보이지 않아 이름만으로 출처를 알 수 있어야 한다.

---

## 함수

### 이벤트 핸들러 — `on{이벤트}{동작}`

props로 주고받는 콜백은 **어떤 이벤트에 무엇을 하는지**를 이름에 담는다.

```tsx
onClickClose // 클릭했을 때 닫는다
onClickStartButton
onChangeKeyword
onSubmitSearch
```

`onClick`·`onChange` 같은 단순형은 쓰지 않는다.

> **Why:** DOM 표준 이벤트명(`onClick`, `onChange`)과 이름이 겹치면, props로 받은 것이 네이티브 이벤트를 그대로 넘긴 것인지 커스텀 콜백인지 이름만으로 구분되지 않는다. 동작을 함께 적으면 호출부에서 무슨 일이 일어나는지 읽힌다.

컴포넌트 내부에서 정의하는 핸들러는 `handle`을 쓴다.

```tsx
const handleClickClose = () => { ... }
return <Button onClickClose={handleClickClose} />
```

> **Why `handle`과 `on`을 나누는가:** `on*`은 "밖에서 주입받는 것", `handle*`은 "안에서 정의하는 것"이다. 구분해 두면 데이터 흐름이 이름만으로 읽힌다.

### 그 밖의 함수

| 유형         | 패턴                       | 예시                                             |
| ------------ | -------------------------- | ------------------------------------------------ |
| 불리언 반환  | `is` / `has` / `can`       | `isLegendary`, `hasAppliedFilter`                |
| 값 생성·조회 | `get` / `build` / `format` | `getBackgroundColor`, `buildChampionsDetailHref` |
| 변환         | `to` / `parse`             | `parseGenderRate`                                |

---

## 훅

`use` + 대상. 반환값이 아니라 **역할**을 이름으로 삼는다.

```ts
useDebounce()
useOutSideClick()
useEnterViewProgress()
```

---

## 타입·인터페이스

PascalCase. 컴포넌트 props는 `{컴포넌트명}Props`.

```tsx
interface TagProps { ... }
interface MovesVersionNavItem { ... }
```

`I` 접두사(`ITagProps`)는 쓰지 않는다 — TypeScript 공식 가이드가 권장하지 않는다.

---

## 상수

**모듈 스코프 상수는 `SCREAMING_SNAKE_CASE`.**

```ts
const SITE_NAME = '포케 코리아'
const ADSENSE_CLIENT = 'ca-pub-...'
```

함수 안의 지역 상수는 `camelCase`를 쓴다 — 재할당하지 않는다고 모두 대문자로 쓰면 구분이 사라진다.

---

## 폴더

`structure.md`가 규정한다. 요약하면 최상위는 복수형(`components/`), DS 원자는 단수(`button/`), 점(`.`) 대신 하이픈을 쓴다.

---

## 요약

| 대상        | 규칙                    | 예시                |
| ----------- | ----------------------- | ------------------- |
| 파일        | 계층 접미사             | `Tag.component.tsx` |
| 컴포넌트    | PascalCase, 접미사 없음 | `Tag`               |
| props 타입  | `{이름}Props`           | `TagProps`          |
| 콜백 props  | `on{이벤트}{동작}`      | `onClickClose`      |
| 내부 핸들러 | `handle{이벤트}{동작}`  | `handleClickClose`  |
| 훅          | `use` + 역할            | `useDebounce`       |
| 모듈 상수   | `SCREAMING_SNAKE`       | `SITE_NAME`         |
