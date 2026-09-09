# ADR-0017: 네이밍 규칙 분리와 접미사 체계 정리

- **상태**: 승인
- **날짜**: 2026-09-09
- **담당**: jsg3121 + Claude

## 맥락

[ADR-0016](./ADR-0016-folder-structure-by-domain-usage.md)으로 폴더 배치 기준을 세운 뒤, 파일명·컴포넌트명 규칙을 점검하는 과정에서 세 가지가 드러났다.

**1. 네이밍 규칙이 `coding.md`에 섞여 있었다.** 네이밍은 파일명만의 문제가 아니라 컴포넌트·함수·훅·타입·상수에 모두 걸치는 축인데, 코드 작성 규칙과 한 문서에 있어 성격이 뒤엉켰다.

**2. 접미사 체계가 실제와 어긋났다.**

- `.desktop.tsx`·`.mobile.tsx`가 규정돼 있으나 해당 파일은 **0개**다([ADR-0007](./ADR-0007-responsive-rendering-strategy.md)로 폐기된 구조).
- `.organism.tsx` 4개가 쓰이지만 네이밍 표에 없다. 그중 `ChampionsFormatTab.organism`은 **사용처가 0곳**인 죽은 파일이다.
- 접미사가 아예 없는 파일이 48개이며, `adSlot/`(21개)·`views/quiz/`(12개)는 폴더 단위로 일관되게 빠져 있어 관행으로 굳었다.

**3. 컴포넌트 export 이름이 갈렸다.** 같은 폴더 안에서도 `Tag.component.tsx → TagComponent`와 `Portal.component.tsx → Portal`이 공존한다. 접미사가 붙은 export가 140개(Component 58 · Container 53 · View 25 · Organism 4)이고, 이를 물려받은 타입명이 `SectionHeadingComponentProps`처럼 `Component`를 두 번 담는다.

## 결정

**네이밍 지침(`conventions/guides/naming.md`)을 분리 신설하고, 다음을 확정한다.**

### 1. 문서 역할 분리

| 문서           | 담당                                                    |
| -------------- | ------------------------------------------------------- |
| `structure.md` | 어느 **폴더**에 두는가                                  |
| `naming.md`    | 어떤 **이름**을 붙이는가                                |
| `coding.md`    | 어떻게 **작성**하는가 (계층 책임, 참조 규칙, 작성 패턴) |

### 2. 파일명 접미사

계층을 나타내는 접미사를 유지한다 — `.component` · `.container` · `.view` · `.context` · `.module` · `.util` · `.types`.

`.desktop`·`.mobile`은 제거하고, `.organism`은 쓰지 않는다.

**폴더 단위 예외를 두지 않는다.** `adSlot/`·`views/quiz/`도 규칙을 따른다.

### 3. 컴포넌트 이름에는 접미사를 붙이지 않는다

```tsx
// components/tag/Tag.component.tsx
interface TagProps { ... }
const Tag = ({ ... }: TagProps) => { ... }
```

### 4. 이벤트 핸들러는 `on{이벤트}{동작}`

props 콜백은 `onClickClose`·`onChangeKeyword` 형태로 쓰고, `onClick`·`onChange` 같은 단순형은 쓰지 않는다. 컴포넌트 내부에서 정의하는 핸들러는 `handle{이벤트}{동작}`을 쓴다.

## 근거

**접미사를 유지하는 이유.** 도메인 폴더 구조에서는 같은 이름의 파일이 여러 계층에 존재할 수 있다. `components/champions/`와 `containers/champions/`에 각각 `ChampionsCard`가 있으면 에디터 탭에서 구분되지 않는다. 파일 경로는 탭에 표시되지 않으므로 접미사가 유일한 단서다.

`.module`·`.util`도 유지한다. 처음에는 "전역 폴더가 하나뿐이라 정보를 더하지 않는다"고 판단했으나, ADR-0016의 배치 규칙상 **도메인 하위에도 모듈이 존재할 수 있다**(`containers/detail/modules/activeForm.module.ts`가 실재). 위치가 두 곳 이상이면 접미사가 성격을 말해준다.

**`.organism`을 없애는 이유.** 판정 기준이 없다. `FilterBar`는 organism인데 `MoveTable`(164줄, 내부 컴포넌트 보유)은 component인 이유를 설명할 수 없다. 또 `structure.md`의 폴더 체계에 organism 층이 없어, 파일명만 Atomic Design을 따르고 폴더는 도메인 기준인 혼재 상태가 된다. ADR-0010은 "원자부터 만들자"는 **빌드 순서** 결정이지 파일명 규칙이 아니다.

**컴포넌트 이름에서 접미사를 빼는 이유.** 파일명이 이미 계층을 말하므로 이름이 반복할 필요가 없다. `TagComponentProps`처럼 타입명이 `Component`를 두 번 담는 것은 정보가 아니라 소음이다. import 구문에 경로가 함께 보이므로 출처도 잃지 않는다.

**`on{이벤트}{동작}`을 쓰는 이유.** `onClick`·`onChange`는 DOM 표준 이벤트명과 겹쳐, props로 받은 것이 네이티브 이벤트를 그대로 넘긴 것인지 커스텀 콜백인지 이름만으로 구분되지 않는다. 동작을 함께 적으면 호출부에서 무슨 일이 일어나는지 읽힌다. 실제로 이 형식이 이미 더 많이 쓰이고 있었다(`onClickCloseModal`·`onClickStartButton`·`onClickAnswer` 등 8종 vs 단순형 3종).

## 대안

| 대안                                     | 장점                        | 단점                                                                 | 불채택 사유                                                                                                 |
| ---------------------------------------- | --------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **접미사 전부 제거**                     | 이름이 짧아지고 판정 불필요 | 에디터 탭에서 계층 구분 불가, 같은 이름 파일이 여럿 생김             | 도메인 폴더 구조에서 `components/champions/`와 `containers/champions/`의 동명 파일을 구분할 수단이 사라진다 |
| **현행 유지 + organism만 제거**          | 변경 최소                   | `.desktop`·`.mobile` 사문화 규칙이 남고, export 이름 불일치도 그대로 | 일관성을 우선하기로 결정                                                                                    |
| **폴더 단위 예외 인정**(`adSlot`·`quiz`) | 33개 파일 변경 회피         | "어디까지가 예외인가"를 매번 판단해야 함                             | 이미 `containers/`에 `.component.tsx`가 섞이는 등 경계가 흐려진 상태다                                      |
| **컴포넌트명 접미사 유지**               | 변경 없음                   | 타입명이 `XxxComponentProps`로 길어짐                                | 같은 정보를 파일명·컴포넌트명·타입명에 세 번 반복한다                                                       |

## 결과

- `conventions/guides/naming.md` 신설, `conventions/index.md`에 등재.
- `coding.md`에서 파일 네이밍 절을 제거한다(ADR-0018).
- 후속 정리 대상:
  - 접미사 없는 파일 48개(`adSlot` 21 · `views/quiz` 12 · 기타 15)에 접미사 부여
  - `.organism` 4개 → `.component`, 그중 미사용 `ChampionsFormatTab.organism`은 삭제 검토
  - `.desktop`·`.mobile` — 해당 파일 없음, 규칙만 제거
  - 컴포넌트 export 이름 140개에서 접미사 제거 + Props 타입명·import 구문 동반 수정
  - 이벤트 핸들러 단순형(`onClose`·`onClick`·`onChange`) → `on{이벤트}{동작}`
- 변경 규모가 크므로 파일 재배치(ADR-0016 후속)와 함께 일괄 진행한다.

## 참고 자료

- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) — 인터페이스 `I` 접두사를 쓰지 않는 근거
- [ADR-0010](./ADR-0010-atomic-first-ds-build-order.md) — 원자 우선 빌드 순서, `.organism` 접미사의 출처
- [ADR-0016](./ADR-0016-folder-structure-by-domain-usage.md) — 폴더 배치 기준, 도메인 로컬 모듈의 근거
