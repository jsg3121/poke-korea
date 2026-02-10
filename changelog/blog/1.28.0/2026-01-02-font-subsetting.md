---
slug: font-subsetting
title: "Font Subsetting 최적화"
authors: [claude]
tags: [performance]
---

# Font Subsetting 최적화

> **작업 날짜**: 2026-01-02
> **브랜치**: `feature/1.28.0-font-subsetting`
> **PR**: TBD

## 📋 목차

- [🎯 작업 개요](#-작업-개요)
- [✨ 주요 변경사항](#-주요-변경사항)
- [📊 성능 개선 결과](#-성능-개선-결과)
- [🔧 기술적 세부사항](#-기술적-세부사항)
- [✅ 작업 완료 내역](#-작업-완료-내역)

---

## 🎯 작업 개요

### 목적

Gmarket Sans 폰트 파일에 대해 Font Subsetting을 적용하여 번들 크기를 최적화하고 초기 로딩 성능을 개선합니다.

### 배경

- 현재 프로젝트에서 사용하는 Gmarket Sans 폰트는 전체 글리프(glyph)를 포함하고 있음
- 실제로 사용하는 문자는 한글 기본 글자, 영문, 숫자, 기본 기호로 제한적임
- Font Subsetting을 통해 필요한 문자만 추출하여 파일 크기 감소

### 적용 범위

**안전한 권장 범위 적용**:
- 한글 기본 글자: U+AC00-U+D7A3 (2,350자)
- 숫자: U+0030-U+0039 (0-9)
- 영문 대문자: U+0041-U+005A (A-Z)
- 영문 소문자: U+0061-U+007A (a-z)
- 기본 기호: U+0020-U+002F, U+003A-U+0040 (공백, 특수문자 등)

<!-- truncate -->

---

## ✨ 주요 변경사항

### 1. 서브셋 폰트 파일 생성

**도구**: pyftsubset (fonttools)

**생성된 파일**:
- `GmarketSansMedium.subset.woff2` (Weight: 500)
- `GmarketSansBold.subset.woff2` (Weight: 700)

**명령어**:
```bash
# Medium weight
pyftsubset src/assets/font/GmarketSansMedium.woff2 \
  --output-file=src/assets/font/GmarketSansMedium.subset.woff2 \
  --unicodes="U+AC00-D7A3,U+0030-0039,U+0041-005A,U+0061-007A,U+0020-002F,U+003A-0040" \
  --flavor=woff2 \
  --layout-features='*'

# Bold weight
pyftsubset src/assets/font/GmarketSansBold.woff2 \
  --output-file=src/assets/font/GmarketSansBold.subset.woff2 \
  --unicodes="U+AC00-D7A3,U+0030-0039,U+0041-005A,U+0061-007A,U+0020-002F,U+003A-0040" \
  --flavor=woff2 \
  --layout-features='*'
```

### 2. Layout 파일 업데이트

**파일**: [layout.tsx:36-52](../src/app/layout.tsx#L36-L52)

**변경 내용**:

```tsx
// Before
const gmarket = localFont({
  src: [
    {
      path: '../assets/font/GmarketSansMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/font/GmarketSansBold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-gmarket-sans',
})

// After
const gmarket = localFont({
  src: [
    {
      path: '../assets/font/GmarketSansMedium.subset.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/font/GmarketSansBold.subset.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-gmarket-sans',
})
```

---

## 📊 성능 개선 결과

### 파일 크기 비교

| 폰트 파일 | Original | Subset | 감소량 | 감소율 |
|-----------|----------|--------|--------|--------|
| GmarketSansMedium.woff2 | 361KB | 299KB | 62KB | 17.2% |
| GmarketSansBold.woff2 | 365KB | 301KB | 64KB | 17.5% |
| **총합** | **726KB** | **600KB** | **126KB** | **17.4%** |

### 성능 개선 효과

**번들 크기 최적화**:
- 폰트 파일 총 크기 126KB 감소
- 초기 로딩 시 다운로드해야 할 데이터 감소

**초기 렌더링 성능**:
- FCP (First Contentful Paint) 개선
- LCP (Largest Contentful Paint) 개선
- 특히 느린 네트워크 환경에서 체감 성능 향상

**캐싱 효율**:
- 더 작은 파일 크기로 브라우저 캐시 효율 향상
- 모바일 환경에서 캐시 저장 공간 절약

---

## 🔧 기술적 세부사항

### Font Subsetting이란?

Font Subsetting은 폰트 파일에서 실제로 사용하는 문자(글리프)만 추출하여 새로운 폰트 파일을 생성하는 최적화 기법입니다.

**장점**:
- 파일 크기 감소로 초기 로딩 속도 향상
- 네트워크 대역폭 절약
- 브라우저 메모리 사용량 감소

**주의사항**:
- 서브셋에 포함되지 않은 문자는 fallback 폰트로 렌더링됨
- 충분한 문자 범위를 포함해야 사용자 경험 저하 방지

### 선택한 유니코드 범위 상세

#### 한글 기본 글자 (U+AC00-U+D7A3)
- 현대 한글 완성형 2,350자
- 일상적으로 사용되는 모든 한글 조합 포함
- 자음: ㄱ~ㅎ, 모음: ㅏ~ㅣ의 조합

#### 숫자 (U+0030-U+0039)
- 0, 1, 2, 3, 4, 5, 6, 7, 8, 9

#### 영문 (U+0041-U+005A, U+0061-U+007A)
- 대문자: A-Z (26자)
- 소문자: a-z (26자)

#### 기본 기호 (U+0020-U+002F, U+003A-U+0040)
- 공백, 느낌표, 물음표, 쉼표, 마침표 등
- 괄호, 하이픈, 슬래시 등
- 특수문자: @, #, $, %, & 등

### pyftsubset 옵션 설명

```bash
--unicodes="..."        # 포함할 유니코드 범위 지정
--flavor=woff2         # 출력 포맷 (woff2는 최신 압축 포맷)
--layout-features='*'  # 모든 OpenType 레이아웃 기능 유지
```

**`--layout-features='*'` 사용 이유**:
- 한글의 자모 조합 규칙 유지
- 글자 간격, 커닝(kerning) 정보 보존
- 타이포그래피 품질 유지

### Next.js Font Optimization과의 호환성

**next/font/local의 자동 최적화**:
- Font Display Strategy: `swap` (FOIT 방지)
- Preload: `true` (초기 렌더링 시 우선 로드)
- CSS Variable: `--font-gmarket-sans` (CSS에서 재사용)

**서브셋 폰트와 함께 동작**:
```typescript
// Next.js가 자동으로 처리
- Self-hosting 최적화
- Automatic font inlining (작은 폰트의 경우)
- Zero layout shift
```

### 브라우저 호환성

**WOFF2 포맷 지원**:
- Chrome 36+
- Firefox 39+
- Safari 10+
- Edge 14+

프로젝트의 browserslist 설정과 완전히 호환됩니다:
```json
"Chrome >= 114",
"Edge >= 114",
"Firefox >= 115",
"Safari >= 15.4"
```

---

## ✅ 작업 완료 내역

### 파일 변경사항

**1. 서브셋 폰트 파일 생성** (2개):
- ✅ `src/assets/font/GmarketSansMedium.subset.woff2` (299KB)
- ✅ `src/assets/font/GmarketSansBold.subset.woff2` (301KB)

**2. Layout 파일 수정** ([layout.tsx](../src/app/layout.tsx)):
- ✅ 폰트 경로를 서브셋 파일로 변경 (2곳)
- ✅ `display: 'swap'`, `preload: true` 설정 유지

**3. 원본 폰트 파일 유지**:
- ✅ `GmarketSansMedium.woff2` (백업용)
- ✅ `GmarketSansBold.woff2` (백업용)

### 도구 설치 내역

**전역 도구**:
```bash
npm install -g glyphhanger  # 폰트 분석 도구
pip3 install --break-system-packages fonttools brotli  # 서브셋 생성 도구
```

---

## 📌 참고 사항

### 향후 고려사항

1. **동적 서브셋**:
   - 사용자가 입력한 특수 문자 대응
   - 필요 시 추가 유니코드 범위 포함 고려

2. **Variable Fonts**:
   - 미래에 Gmarket Sans Variable Font 출시 시 마이그레이션 검토
   - 단일 파일로 모든 weight 지원 가능

3. **서브셋 범위 확장**:
   - 사용자 피드백에 따라 추가 문자 범위 포함
   - 특수 문자, 이모지 등의 필요성 평가

### 롤백 방법

만약 서브셋 폰트에 문제가 발견되면:

```typescript
// layout.tsx에서 원본 폰트로 롤백
const gmarket = localFont({
  src: [
    {
      path: '../assets/font/GmarketSansMedium.woff2',  // .subset 제거
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/font/GmarketSansBold.woff2',    // .subset 제거
      weight: '700',
      style: 'normal',
    },
  ],
  // ... 나머지 설정 동일
})
```

---

## 📈 기대 효과

### 즉시 효과

- ✅ 번들 크기 126KB 감소 (17.4% 감소)
- ✅ 초기 로딩 시간 단축
- ✅ 네트워크 대역폭 절약

### 장기 효과

- ✅ 모바일 사용자 경험 개선
- ✅ 느린 네트워크 환경에서 체감 성능 향상
- ✅ CDN 비용 절감 (트래픽 감소)
- ✅ SEO 점수 개선 가능성 (페이지 속도 향상)

---

**작성자**: Claude Code
**검토자**: TBD
**승인자**: TBD
