# page-scaffold 템플릿

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
