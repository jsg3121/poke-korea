# 퀴즈 페이지 SEO 개선 (quiz-seo)

## 📋 작업 개요

**브랜치**: `feature/1.32.0-quiz-seo`
**작업 유형**: SEO / 버그 수정 / 리팩토링
**작업 기간**: 2026-01-29
**담당**: Claude Code

## 🎯 작업 목표

퀴즈 페이지(5개)의 SEO 설정을 점검하고, 발견된 오류를 수정하며 구조화 데이터를 강화하고 메타데이터를 상수화한다.

## ✨ 주요 변경사항

### 변경 1: 메인 퀴즈 페이지 BreadcrumbList 오류 수정

**변경 전**:

```typescript
// src/constants/quizJsonLd.ts - QUIZ_WEBPAGE_JSON_LD
{
  '@type': 'ListItem',
  position: 2,
  name: '타입 상성 계산기',  // 잘못된 표기
  item: 'https://poke-korea.com/quiz',
}
```

**변경 후**:

```typescript
{
  '@type': 'ListItem',
  position: 2,
  name: '포켓몬 퀴즈',  // 실제 페이지명과 일치
  item: 'https://poke-korea.com/quiz',
}
```

### 변경 2: 메인 퀴즈 JSON-LD에 ItemList 추가

4가지 퀴즈 종류를 `QUIZ_ITEMLIST_JSON_LD` 상수로 구조화하여 메인 퀴즈 페이지에 추가.

```typescript
export const QUIZ_ITEMLIST_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '포켓몬 퀴즈 목록',
  numberOfItems: 4,
  itemListElement: [
    { position: 1, name: '포켓몬 실루엣 퀴즈', url: '...' },
    { position: 2, name: '포켓몬 특성 퀴즈', url: '...' },
    { position: 3, name: '포켓몬 타입 퀴즈', url: '...' },
    { position: 4, name: '포켓몬 타입 상성 퀴즈', url: '...' },
  ],
}
```

### 변경 3: 모든 퀴즈 JSON-LD에 `primaryImageOfPage` 추가

5개 퀴즈 상수 모두에 `primaryImageOfPage` 필드를 추가. 기존 `QUIZ_WEBPAGE_JSON_LD`의 `image` 문자열 필드는 `ImageObject` 구조로 교체.

```typescript
primaryImageOfPage: {
  '@type': 'ImageObject',
  url: 'https://poke-korea.com/assets/image/ogImage.png',
  width: 1200,
  height: 630,
},
```

### 변경 4: 개별 퀴즈 JSON-LD에 `url` 필드 추가

4개 개별 퀴즈 상수에 각 페이지의 `url` 필드를 추가. (기존에는 `QUIZ_WEBPAGE_JSON_LD`에만 있었음)

| 상수 | 추가된 url |
| ---- | ---------- |
| `POKEMON_TYPE_QUIZ_JSON_LD` | `https://poke-korea.com/quiz/pokemon-type` |
| `ABILITY_QUIZ_JSON_LD` | `https://poke-korea.com/quiz/ability` |
| `SILHOUETTE_QUIZ_JSON_LD` | `https://poke-korea.com/quiz/silhouette` |
| `TYPE_EFFECTIVENESS_QUIZ_JSON_LD` | `https://poke-korea.com/quiz/type-effectiveness` |

### 변경 5: 퀴즈 SEO 메타데이터 상수화

5개 퀴즈 페이지의 인라인 메타데이터를 `seoMetaData.ts`로 이관. `createQuizMetadata` 헬퍼 함수로 공통 구조를 생성하고, 각 페이지에서 상수를 import하여 사용.

**변경 전** (각 page.tsx에 인라인 ~30줄):

```typescript
export const metadata: Metadata = {
  title: '...',
  description: '...',
  robots: getRobotsConfig(),
  openGraph: { ... },
  alternates: { ... },
  twitter: { ... },
}
```

**변경 후** (각 page.tsx에서 1줄):

```typescript
import { QUIZ_MAIN_META } from '~/constants/seoMetaData'
export const metadata = QUIZ_MAIN_META
```

**추가된 상수**:

| 상수명 | 대상 페이지 |
| ------ | ----------- |
| `QUIZ_MAIN_META` | `/quiz` |
| `QUIZ_SILHOUETTE_META` | `/quiz/silhouette` |
| `QUIZ_ABILITY_META` | `/quiz/ability` |
| `QUIZ_POKEMON_TYPE_META` | `/quiz/pokemon-type` |
| `QUIZ_TYPE_EFFECTIVENESS_META` | `/quiz/type-effectiveness` |

**주요 영향 파일**:

- [src/constants/quizJsonLd.ts](../../src/constants/quizJsonLd.ts)
- [src/constants/seoMetaData.ts](../../src/constants/seoMetaData.ts)
- [src/app/quiz/page.tsx](../../src/app/quiz/page.tsx)
- [src/app/quiz/silhouette/page.tsx](../../src/app/quiz/silhouette/page.tsx)
- [src/app/quiz/ability/page.tsx](../../src/app/quiz/ability/page.tsx)
- [src/app/quiz/pokemon-type/page.tsx](../../src/app/quiz/pokemon-type/page.tsx)
- [src/app/quiz/type-effectiveness/page.tsx](../../src/app/quiz/type-effectiveness/page.tsx)

## 🔍 SEO 분석 결과

### 퀴즈 페이지 SEO 현황 (개선 후)

| 항목               | `/quiz`    | `/quiz/silhouette` | `/quiz/ability` | `/quiz/pokemon-type` | `/quiz/type-effectiveness` |
| ------------------ | ---------- | ------------------ | --------------- | -------------------- | -------------------------- |
| Title              | O          | O                  | O               | O                    | O                          |
| Description        | O          | O                  | O               | O                    | O                          |
| Canonical URL      | O          | O                  | O               | O                    | O                          |
| OpenGraph          | O          | O                  | O               | O                    | O                          |
| Twitter Card       | O          | O                  | O               | O                    | O                          |
| JSON-LD WebPage    | O          | O                  | O               | O                    | O                          |
| BreadcrumbList     | **수정됨** | O                  | O               | O                    | O                          |
| ItemList           | **추가됨** | -                  | -               | -                    | -                          |
| primaryImageOfPage | **추가됨** | **추가됨**         | **추가됨**      | **추가됨**           | **추가됨**                 |
| url 필드           | O          | **추가됨**         | **추가됨**      | **추가됨**           | **추가됨**                 |
| 메타데이터 상수화  | **완료**   | **완료**           | **완료**        | **완료**             | **완료**                   |

## 📊 최적화 결과

| 항목                         | 변경 전                  | 변경 후                    | 비고            |
| ---------------------------- | ------------------------ | -------------------------- | --------------- |
| BreadcrumbList 정확도        | 오류 (잘못된 name)       | 정상                       | 즉시 수정       |
| ItemList 구조화              | 미적용                   | 4개 퀴즈 목록 구조화       | 신규 추가       |
| primaryImageOfPage           | 1개 (image 문자열)       | 5개 (ImageObject 구조)     | 전체 추가       |
| 개별 퀴즈 url 필드           | 0개                      | 4개                        | 전체 추가       |
| 메타데이터 관리 방식         | 인라인 (각 ~30줄)        | 상수화 (각 1줄)            | 유지보수성 향상 |
| 메타데이터 코드 중복 제거    | 5개 파일에 ~150줄 중복   | `seoMetaData.ts` 1개 파일  | 약 120줄 감소   |

## 🔧 기술적 세부사항

### 수정 파일 목록

| 파일                                           | 변경 내용                                             |
| ---------------------------------------------- | ----------------------------------------------------- |
| `src/constants/quizJsonLd.ts`                  | BreadcrumbList 수정, ItemList 추가, primaryImageOfPage 추가, url 필드 추가 |
| `src/constants/seoMetaData.ts`                 | 퀴즈 메타데이터 상수 5개 + 헬퍼 함수 추가             |
| `src/app/quiz/page.tsx`                        | 메타데이터 상수 import, ItemList script 태그 추가      |
| `src/app/quiz/silhouette/page.tsx`             | 메타데이터 상수 import으로 교체                        |
| `src/app/quiz/ability/page.tsx`                | 메타데이터 상수 import으로 교체                        |
| `src/app/quiz/pokemon-type/page.tsx`           | 메타데이터 상수 import으로 교체                        |
| `src/app/quiz/type-effectiveness/page.tsx`     | 메타데이터 상수 import으로 교체                        |

### `createQuizMetadata` 헬퍼 함수

`seoMetaData.ts`에 추가된 내부 헬퍼 함수로, 퀴즈 페이지의 공통 메타데이터 구조(title, description, robots, openGraph, alternates, twitter)를 생성합니다. 공통 상수(`SITE_NAME`, `SITE_URL`, `OG_IMAGE_URL`)를 사용하여 URL 하드코딩을 제거했습니다.

## ✅ 테스트 체크리스트

- [x] `quizJsonLd.ts` 문법 오류 없음
- [x] `seoMetaData.ts` 문법 오류 없음
- [ ] 메인 퀴즈 페이지(`/quiz`) BreadcrumbList 정상 렌더링 확인
- [ ] 메인 퀴즈 페이지(`/quiz`) ItemList JSON-LD 정상 렌더링 확인
- [ ] 각 퀴즈 페이지 메타데이터(title, description, OG, Twitter) 정상 출력 확인
- [ ] Google Rich Results Test로 구조화 데이터 검증

## 🚀 머지 정보

**머지 대상**: `feature/1.32.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- 기본 SEO 설정(title, description, canonical, OG, Twitter Card)은 모든 퀴즈 페이지에 정상 적용되어 있었음
- 개별 퀴즈 4개 페이지의 BreadcrumbList는 기존에도 정상 (3단계: 홈 > 퀴즈 > 각 퀴즈)
- BreadcrumbList 오류는 메인 퀴즈 페이지(`QUIZ_WEBPAGE_JSON_LD`)에만 존재했음
- `getRobotsConfig()`의 `googleBot` 별도 설정은 불필요 (일반 `robots` 태그를 Google 봇이 그대로 따름)
- `TYPE_EFFECTIVNESS_SEO_META` 기존 상수명의 오타("EFFECTIVNESS")는 이번 작업 범위에서 제외
