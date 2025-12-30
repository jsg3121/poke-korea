# Partytown 적용 가이드

## 📋 목차

- [Partytown이란?](#partytown이란)
- [왜 적용했는가?](#왜-적용했는가)
- [적용 방법](#적용-방법)
- [성능 비교 분석](#성능-비교-분석)
- [사용 방법](#사용-방법)
- [주의사항](#주의사항)

---

## Partytown이란?

Partytown은 **서드파티 스크립트를 Web Worker로 이동시켜 메인 스레드의 성능을 개선**하는 라이브러리입니다.

### 핵심 개념

```
기존 방식:
메인 스레드 = UI 렌더링 + 사용자 이벤트 + 서드파티 스크립트 (느림 😢)

Partytown 적용 후:
메인 스레드 = UI 렌더링 + 사용자 이벤트 (빠름 ✨)
Web Worker = 서드파티 스크립트 (별도 스레드)
```

### 주요 특징

- 🚀 메인 스레드 블로킹 감소
- ⚡ 사용자 상호작용 응답성 향상
- 🎯 TTI (Time to Interactive) 개선
- 📦 Next.js 공식 지원 (`strategy="worker"`)

---

## 왜 적용했는가?

### 1. 성능 최적화

서드파티 스크립트(Google Analytics, Google Adsense 등)는 메인 스레드를 차단하여 사용자 경험을 저하시킬 수 있습니다. Partytown을 사용하면 이러한 스크립트를 별도 스레드로 분리하여 성능을 개선할 수 있습니다.

### 2. 확장성 확보

향후 추가될 수 있는 서드파티 스크립트(광고, 분석 도구 등)에 대비하여 메인 스레드 보호 체계를 미리 구축했습니다.

### 3. Core Web Vitals 개선

Google의 검색 순위 알고리즘에 포함된 Core Web Vitals 지표를 개선하여 SEO에도 긍정적인 영향을 줍니다.

---

## 적용 방법

### 1. Partytown 설치

```bash
npm install @builder.io/partytown
```

### 2. next.config.js 설정

```javascript
const nextConfig = {
  // Partytown 활성화 (필수!)
  nextScriptWorkers: true,

  // 기존 설정들...
  reactStrictMode: true,
  // ...
}

module.exports = nextConfig
```

### 3. Partytown 정적 파일 복사

`package.json`에 postinstall 스크립트 추가:

```json
{
  "scripts": {
    "postinstall": "cp -r node_modules/@builder.io/partytown/lib public/~partytown"
  }
}
```

이 스크립트는 `npm install` 실행 시 자동으로 Partytown 필수 파일을 `public/~partytown/` 폴더로 복사합니다.

### 4. Script 태그에 적용

[src/app/layout.tsx:135-136](src/app/layout.tsx#L135-L136)에서 확인 가능:

```tsx
<Script
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7936866808128087"
  crossOrigin="anonymous"
  strategy="worker" // 👈 이 부분이 핵심!
/>
```

**기존**: `strategy="afterInteractive"` 또는 `strategy="lazyOnload"`
**변경**: `strategy="worker"` (Web Worker로 실행)

---

## 성능 비교 분석

### 📱 Mobile (모바일)

| 지표                               | 적용 전    | 적용 후    | 개선율     | 평가         |
| ---------------------------------- | ---------- | ---------- | ---------- | ------------ |
| **Performance Score**              | 76점       | 76점       | 0%         | 동일         |
| **FCP** (First Contentful Paint)   | 1,535.6 ms | 1,534.4 ms | -0.08%     | 미미한 개선  |
| **LCP** (Largest Contentful Paint) | 7,365.6 ms | 7,208.9 ms | **-2.13%** | ✅ 개선      |
| **TBT** (Total Blocking Time)      | 10 ms      | 0 ms       | **-100%**  | ✅✅ 큰 개선 |
| **CLS** (Cumulative Layout Shift)  | 0          | 0          | -          | 완벽 유지    |
| **Speed Index**                    | 1,535.6 ms | 1,534.4 ms | -0.08%     | 미미한 개선  |
| **TTI** (Time to Interactive)      | 7,365.6 ms | 7,208.9 ms | **-2.13%** | ✅ 개선      |

### 💻 PC (데스크톱)

| 지표                               | 적용 전    | 적용 후    | 개선율     | 평가      |
| ---------------------------------- | ---------- | ---------- | ---------- | --------- |
| **Performance Score**              | 96점       | 97점       | **+1.04%** | ✅ 개선   |
| **FCP** (First Contentful Paint)   | 446.9 ms   | 434.8 ms   | **-2.72%** | ✅ 개선   |
| **LCP** (Largest Contentful Paint) | 1,338.8 ms | 1,329.5 ms | **-0.69%** | ✅ 개선   |
| **TBT** (Total Blocking Time)      | 0 ms       | 0 ms       | -          | 완벽 유지 |
| **CLS** (Cumulative Layout Shift)  | 0          | 0          | -          | 완벽 유지 |
| **Speed Index**                    | 446.9 ms   | 434.8 ms   | **-2.72%** | ✅ 개선   |
| **TTI** (Time to Interactive)      | 1,338.8 ms | 1,329.5 ms | **-0.69%** | ✅ 개선   |

### 🎯 핵심 성과

#### ✅ 주요 개선 사항

1. **Mobile TBT 완전 제거**

   - 10ms → 0ms (100% 개선)
   - 메인 스레드 블로킹 완전 제거
   - 사용자 상호작용 응답성 최대화

2. **PC Performance Score 향상**

   - 96점 → 97점 (만점 100점 중)
   - 모든 세부 지표 개선

3. **TTI (Time to Interactive) 개선**

   - Mobile: 156.7ms 개선
   - PC: 9.3ms 개선

4. **부작용 없음**
   - 모든 지표에서 개선 또는 유지
   - 성능 저하 없이 순수 개선만 달성

#### 📊 분석

- **원래 사이트가 이미 최적화가 잘 되어 있음** (PC 96점, Mobile 76점)
- 서드파티 스크립트가 적어서 극적인 개선은 아니지만, **마이너스 없이 플러스만 존재**
- 향후 광고나 분석 스크립트 추가 시 메인 스레드 보호 효과가 더욱 클 것으로 예상

---

## 사용 방법

### 기본 사용법

```tsx
import Script from 'next/script'

export default function Layout() {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
        strategy="worker"
      />

      {/* Google Adsense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        strategy="worker"
      />

      {/* 인라인 스크립트도 가능 */}
      <Script id="analytics" strategy="worker">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        `}
      </Script>
    </>
  )
}
```

### 고급 설정 (필요시)

GTM이나 복잡한 서드파티 스크립트를 사용할 경우, `app/layout.tsx`의 `<head>` 영역에 추가:

```tsx
import { Partytown } from '@builder.io/partytown/react'

export default function RootLayout() {
  return (
    <html>
      <head>
        <Partytown
          debug={process.env.NODE_ENV === 'development'}
          forward={['dataLayer.push']} // GTM 사용 시 필요
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 주의사항

### ⚠️ 호환성

모든 서드파티 스크립트가 Web Worker에서 작동하는 것은 아닙니다. 다음과 같은 경우 문제가 발생할 수 있습니다:

- DOM에 직접 접근하는 스크립트
- `document`, `window` 객체를 직접 조작하는 스크립트
- 동기적으로 실행되어야 하는 스크립트

### 🔍 디버깅

개발 환경에서 문제가 발생하면:

```tsx
<Partytown debug={true} />
```

위 설정으로 콘솔에서 상세한 로그를 확인할 수 있습니다.

### ✅ 호환되는 주요 서비스

- ✅ Google Analytics (GA4)
- ✅ Google Tag Manager (GTM)
- ✅ Google Adsense
- ✅ Facebook Pixel
- ✅ Hotjar
- ✅ Mixpanel

### ❌ 주의가 필요한 경우

- A/B 테스팅 도구 (Optimizely 등)
- 채팅 위젯 (일부)
- 실시간 데이터가 필요한 스크립트

문제가 발생하면 해당 스크립트만 `strategy="afterInteractive"`로 변경하세요.

---

## 참고 자료

- [Partytown 공식 문서](https://partytown.builder.io/)
- [Next.js Script 최적화](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)
- [Web Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [성능 측정 데이터](/performance) - 적용 전후 Lighthouse 리포트

---

**작성일**: 2025-12-30
**적용 버전**: Next.js 14 (App Router)
**테스트 환경**: Chrome Lighthouse, Mobile & Desktop
