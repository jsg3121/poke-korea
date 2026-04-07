desktop/mobile 분리 패턴에 맞는 컴포넌트를 스캐폴딩해줘.

## 입력

- 컴포넌트명: $ARGUMENTS (인자가 없으면 사용자에게 질문)

## 실행 절차

1. 사용자에게 컴포넌트 유형 확인:
   - **페이지 뷰** (views): desktop/mobile 뷰 파일 생성
   - **컨테이너** (container): desktop/mobile 컨테이너 파일 생성
   - **공용 컴포넌트** (components): 단일 컴포넌트 파일 생성
   - **풀 세트**: views + container + component 모두 생성

2. `.claude/conventions/guides/coding.md`의 네이밍 규칙에 따라 파일 생성

3. 생성할 파일 목록을 사용자에게 보여주고 확인

4. 파일 생성

## 파일 생성 패턴

### 페이지 뷰

```
src/views/desktop/{Name}.desktop.tsx
src/views/mobile/{Name}.mobile.tsx
```

### 컨테이너

```
src/container/desktop/{Name}.container.tsx
src/container/mobile/{Name}.container.tsx
```

### 공용 컴포넌트

```
src/components/{name}/{Name}.component.tsx
```

## 템플릿

```tsx
// views - desktop
'use client'

import React from 'react'

const {Name}Desktop = () => {
  return <div></div>
}

export default {Name}Desktop
```

```tsx
// container - desktop
'use client'

import React from 'react'

const {Name}Container = () => {
  return <div></div>
}

export default {Name}Container
```

## 주의사항

- 파일 생성 전에 반드시 사용자에게 파일 목록을 보여주고 확인을 받는다.
- 경로 별칭 `~/` 사용
- Tailwind CSS 유틸리티 클래스 사용
- `'use client'` 지시문은 클라이언트 컴포넌트에만 추가
