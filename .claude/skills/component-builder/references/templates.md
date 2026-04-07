# component-builder 템플릿

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
