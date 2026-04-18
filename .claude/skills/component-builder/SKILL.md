---
name: component-builder
description: |
  Astro/Svelte 컴포넌트 생성 스킬. 프로젝트 컨벤션과 Tailwind 스타일링에 맞는 단일 컴포넌트를 생성한다.
  TRIGGER when: "컴포넌트 만들어줘", "컴포넌트 생성", "버튼/카드/모달 만들어줘" 요청, 단일 컴포넌트 생성 필요
  DO NOT TRIGGER when: 페이지 전체 구현(ui-publisher 에이전트 사용), 여러 컴포넌트가 연결된 복잡한 UI, UX 설계 필요(ux-designer 에이전트 사용)
disable-model-invocation: true
---

# 컴포넌트 생성 스킬

프로젝트의 컨벤션과 디자인 패턴에 맞는 Astro/Svelte 컴포넌트를 생성한다.

## 컴포넌트 유형 판단

### Astro 컴포넌트 (.astro)

인터랙션이 없는 정적 UI에 사용한다:

- 레이아웃, 페이지 셸
- 카드, 배너, 푸터 등 정적 표시 컴포넌트
- SEO 랜딩 페이지의 콘텐츠 섹션
- JSON-LD, 메타태그 등 `<head>` 주입 컴포넌트

### Svelte 컴포넌트 (.svelte)

사용자 인터랙션이 필요한 UI에 사용한다:

- 체크박스, 라디오, 셀렉트 등 폼 요소
- 실시간 미리보기, 코드 에디터
- 다운로드/복사 버튼 (클릭 핸들러)
- 토글, 아코디언 등 상태 기반 UI

## 생성 프로세스

### 1. 요구사항 확인

사용자의 요청에서 다음을 파악한다:

- 어떤 UI인지 (용도, 기능)
- 인터랙션이 필요한지 → Astro vs Svelte 결정
- 어느 페이지/기능에서 사용되는지

### 2. 기존 컴포넌트 확인

중복 방지를 위해 기존 컴포넌트를 탐색한다:

```bash
find src/components -name "*.astro" -o -name "*.svelte" | sort
```

### 3. 컨벤션 참조

생성 전 반드시 확인:

- `.claude/conventions/guides/coding.md` — 네이밍, 화살표 함수, const, JSDoc 등
- `.claude/conventions/guides/styling.md` — Tailwind 유틸리티 우선, @apply 지양
- `.claude/seo/guides/semantic-html.md` — 시맨틱 태그, heading 계층

### 4. Astro 컴포넌트 템플릿

```astro
---
interface Props {
  title: string
  description?: string
}

const { title, description } = Astro.props
---

<section class="p-6 rounded-lg bg-white shadow-sm">
  <h2 class="text-xl font-semibold text-gray-800">{title}</h2>
  {description && <p class="mt-2 text-gray-600">{description}</p>}
  <slot />
</section>
```

### 5. Svelte 컴포넌트 템플릿

```svelte
<script lang="ts">
  let { title, onChange }: { title: string; onChange?: (value: string) => void } = $props()

  let value = $state('')

  /** 입력값 변경 시 부모에게 전달한다 */
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    value = target.value
    onChange?.(value)
  }
</script>

<div class="flex flex-col gap-2">
  <label class="text-sm font-medium text-gray-700">{title}</label>
  <input
    type="text"
    {value}
    oninput={handleChange}
    class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
```

## 생성 규칙

- **파일명**: PascalCase (`ConfigGenerator.svelte`, `FileCard.astro`)
- **위치**: `src/components/common/`(공통) 또는 `src/components/{feature}/`(기능별)
- **Props**: TypeScript interface로 정의, 선택 props에는 기본값 제공
- **스타일링**: Tailwind 유틸리티 클래스 직접 사용
- **Svelte 5**: Runes 문법 사용 (`$state`, `$derived`, `$props()`)
- **접근성**: 폼 요소에 `<label>` 연결, 아이콘 버튼에 `aria-label`

## 참고 자료

- [Astro - Components](https://docs.astro.build/en/basics/astro-components/)
- [Svelte 5 - Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Astro - Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
