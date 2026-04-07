새 페이지의 풀 세트(page.tsx + views + container + context + SEO)를 한 번에 스캐폴딩해줘.

## 입력

- 페이지명: $ARGUMENTS (인자가 없으면 사용자에게 질문)

## 실행 절차

1. 사용자에게 다음 정보 확인:
   - **라우트 경로**: `/경로` (예: `/damage-calculator`)
   - **동적 라우트 여부**: `[param]` 필요 여부
   - **Context 필요 여부**: 별도 상태 관리가 필요한지
   - **계산 모듈 필요 여부**: `src/module/` 파일 생성 여부

2. `.claude/conventions/guides/coding.md`의 네이밍 규칙에 따라 파일 목록 생성

3. 생성할 파일 목록을 사용자에게 보여주고 확인

4. 승인 후 파일 생성

## 생성 파일 목록

```text
src/
├── app/{route}/page.tsx                          # 라우트 엔트리 + metadata
├── views/desktop/{Name}.desktop.tsx              # 데스크톱 뷰
├── views/mobile/{Name}.mobile.tsx                # 모바일 뷰
├── container/desktop/{Name}.container.tsx        # 데스크톱 컨테이너
├── container/mobile/{Name}.container.tsx         # 모바일 컨테이너
├── context/{Name}.context.tsx                    # Context (선택)
├── module/{name}.module.ts                       # 계산 모듈 (선택)
└── constants/{name}JsonLd.ts                     # JSON-LD 상수
```

## 템플릿

### page.tsx

```tsx
import { headers } from 'next/headers'
import { Metadata } from 'next'
import { detectUserAgent } from '~/module/device.module'
import {Name}Desktop from '~/views/desktop/{Name}.desktop'
import {Name}Mobile from '~/views/mobile/{Name}.mobile'

export const metadata: Metadata = {
  title: '{페이지 제목} | 포케코리아',
  description: '{페이지 설명 120~160자}',
  alternates: {
    canonical: '/{route}',
  },
  openGraph: {
    title: '{페이지 제목} | 포케코리아',
    description: '{페이지 설명}',
    url: '/{route}',
    type: 'website',
  },
}

const {Name}Page = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  return isMobile ? <{Name}Mobile /> : <{Name}Desktop />
}

export default {Name}Page
```

### views (desktop)

```tsx
'use client'

import React from 'react'
import {Name}Container from '~/container/desktop/{Name}.container'

const {Name}Desktop = () => {
  return (
    <div className="hidden desktop:block">
      <{Name}Container />
    </div>
  )
}

export default {Name}Desktop
```

### views (mobile)

```tsx
'use client'

import React from 'react'
import {Name}Container from '~/container/mobile/{Name}.container'

const {Name}Mobile = () => {
  return (
    <div className="block desktop:hidden">
      <{Name}Container />
    </div>
  )
}

export default {Name}Mobile
```

### container (desktop/mobile)

```tsx
'use client'

import React from 'react'

const {Name}Container = () => {
  return <div></div>
}

export default {Name}Container
```

### context (선택)

```tsx
'use client'

import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { produce } from 'immer'

interface {Name}State {
  // 상태 정의
}

type {Name}Action =
  | { type: 'RESET' }

const initialState: {Name}State = {
  // 초기값
}

const {Name}Context = createContext<{
  state: {Name}State
  dispatch: React.Dispatch<{Name}Action>
} | null>(null)

const reducer = (state: {Name}State, action: {Name}Action): {Name}State => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'RESET':
        return initialState
    }
  })
}

export const {Name}Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <{Name}Context.Provider value={value}>
      {children}
    </{Name}Context.Provider>
  )
}

export const use{Name} = () => {
  const context = useContext({Name}Context)
  if (!context) {
    throw new Error('use{Name} must be used within {Name}Provider')
  }
  return context
}
```

## 주의사항

- 파일 생성 전에 반드시 사용자에게 파일 목록을 보여주고 확인을 받는다.
- 경로 별칭 `~/` 사용
- `'use client'` 지시문은 views, container, context에만 추가
- page.tsx는 서버 컴포넌트로 유지 (metadata export 때문)
- Tailwind CSS 유틸리티 클래스 사용
- desktop/mobile 분리를 위해 `hidden desktop:block` / `block desktop:hidden` 패턴 사용
- `/component-builder` 스킬과의 차이: 이 스킬은 **페이지 단위** 풀 세트, component-builder는 **컴포넌트 단위**
