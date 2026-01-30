# 퀴즈 페이지 SEO 개선 (quiz-seo)

## 📋 작업 개요

**브랜치**: `feature/1.32.0-quiz-seo`
**작업 유형**: SEO / 버그 수정 / 리팩토링
**작업 기간**: 2026-01-29
**담당**: Claude Code

## 🎯 작업 목표

퀴즈 페이지(5개)의 SEO 설정을 점검하고, 발견된 오류를 수정하며 구조화 데이터를 강화하고 메타데이터를 상수화한다. 추가로 외부 SEO 피드백을 반영하여 Title/Description 재작성, JSON-LD 동기화, 앵커 텍스트 개선을 진행한다.

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

| 상수                              | 추가된 url                                       |
| --------------------------------- | ------------------------------------------------ |
| `POKEMON_TYPE_QUIZ_JSON_LD`       | `https://poke-korea.com/quiz/pokemon-type`       |
| `ABILITY_QUIZ_JSON_LD`            | `https://poke-korea.com/quiz/ability`            |
| `SILHOUETTE_QUIZ_JSON_LD`         | `https://poke-korea.com/quiz/silhouette`         |
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

| 상수명                         | 대상 페이지                |
| ------------------------------ | -------------------------- |
| `QUIZ_MAIN_META`               | `/quiz`                    |
| `QUIZ_SILHOUETTE_META`         | `/quiz/silhouette`         |
| `QUIZ_ABILITY_META`            | `/quiz/ability`            |
| `QUIZ_POKEMON_TYPE_META`       | `/quiz/pokemon-type`       |
| `QUIZ_TYPE_EFFECTIVENESS_META` | `/quiz/type-effectiveness` |

**주요 영향 파일**:

- [src/constants/quizJsonLd.ts](../../src/constants/quizJsonLd.ts)
- [src/constants/seoMetaData.ts](../../src/constants/seoMetaData.ts)
- [src/app/quiz/page.tsx](../../src/app/quiz/page.tsx)
- [src/app/quiz/silhouette/page.tsx](../../src/app/quiz/silhouette/page.tsx)
- [src/app/quiz/ability/page.tsx](../../src/app/quiz/ability/page.tsx)
- [src/app/quiz/pokemon-type/page.tsx](../../src/app/quiz/pokemon-type/page.tsx)
- [src/app/quiz/type-effectiveness/page.tsx](../../src/app/quiz/type-effectiveness/page.tsx)

### 변경 6: Title/Description 재작성 (외부 SEO 피드백 P0)

외부 SEO 리뷰 피드백을 반영하여 모든 퀴즈 페이지의 Title과 Description을 구체적 정보(20문제, 4지선다, 결과 확인)를 포함하도록 재작성.

**변경 전**:

```typescript
// seoMetaData.ts - 예시: 메인 퀴즈 페이지
title: '포켓몬 퀴즈 | 포케 코리아'
description: '다양한 포켓몬 퀴즈를 통해 여러분의 포켓몬 지식을 테스트해보세요!'
```

**변경 후**:

```typescript
title: '포켓몬 퀴즈 모음 (실루엣·특성·타입·상성) | 포케 코리아'
description: '실루엣, 특성, 타입, 타입 상성까지 4종류의 포켓몬 퀴즈를 20문제 4지선다로 풀어보세요. 완료 후 결과를 바로 확인할 수 있습니다.'
```

| 페이지                     | 변경된 Title                                              | 핵심 추가 정보    |
| -------------------------- | --------------------------------------------------------- | ----------------- |
| `/quiz`                    | `포켓몬 퀴즈 모음 (실루엣·특성·타입·상성) \| 포케 코리아` | 4종류 퀴즈명 명시 |
| `/quiz/silhouette`         | `포켓몬 실루엣 퀴즈 (20문제) \| 포케 코리아`              | 문제 수 명시      |
| `/quiz/ability`            | `포켓몬 특성 퀴즈 (20문제) \| 포케 코리아`                | 문제 수 명시      |
| `/quiz/pokemon-type`       | `포켓몬 타입 퀴즈 (20문제) \| 포케 코리아`                | 문제 수 명시      |
| `/quiz/type-effectiveness` | `포켓몬 타입 상성 퀴즈 (20문제) \| 포케 코리아`           | 문제 수 명시      |

**JSON-LD 동기화**: `quizJsonLd.ts`의 모든 JSON-LD `name`과 `description`도 메타데이터와 일치하도록 동기화.

### 변경 7: 앵커 텍스트 + aria-label 개선 (외부 SEO 피드백 P0)

퀴즈 메인 페이지(데스크톱/모바일)의 퀴즈 카드 링크에 설명적 앵커 텍스트와 aria-label을 추가하여 SEO 및 접근성 개선.

**변경 전**:

```tsx
<Link key={quiz.type} href={quiz.route} className="...">
  {/* ... */}
  <span className="text-blue-600 text-sm font-medium">시작하기 →</span>
</Link>
```

**변경 후**:

```tsx
<Link
  key={quiz.type}
  href={quiz.route}
  aria-label={`${quiz.title} 시작하기`}
  className="..."
>
  {/* ... */}
  <span className="text-blue-600 text-sm font-medium">
    {quiz.title} 시작하기 <span aria-hidden="true">→</span>
  </span>
</Link>
```

**주요 영향 파일**:

- [src/views/desktop/quiz/QuizMain.desktop.tsx](../../src/views/desktop/quiz/QuizMain.desktop.tsx)
- [src/views/mobile/quiz/QuizMain.mobile.tsx](../../src/views/mobile/quiz/QuizMain.mobile.tsx)

## 🔍 SEO 분석 결과

### 퀴즈 페이지 SEO 현황 (개선 후)

| 항목               | `/quiz`    | `/quiz/silhouette` | `/quiz/ability` | `/quiz/pokemon-type` | `/quiz/type-effectiveness` |
| ------------------ | ---------- | ------------------ | --------------- | -------------------- | -------------------------- |
| Title              | **재작성** | **재작성**         | **재작성**      | **재작성**           | **재작성**                 |
| Description        | **재작성** | **재작성**         | **재작성**      | **재작성**           | **재작성**                 |
| Canonical URL      | O          | O                  | O               | O                    | O                          |
| OpenGraph          | O          | O                  | O               | O                    | O                          |
| Twitter Card       | O          | O                  | O               | O                    | O                          |
| JSON-LD WebPage    | **동기화** | **동기화**         | **동기화**      | **동기화**           | **동기화**                 |
| BreadcrumbList     | **수정됨** | O                  | O               | O                    | O                          |
| ItemList           | **추가됨** | -                  | -               | -                    | -                          |
| primaryImageOfPage | **추가됨** | **추가됨**         | **추가됨**      | **추가됨**           | **추가됨**                 |
| url 필드           | O          | **추가됨**         | **추가됨**      | **추가됨**           | **추가됨**                 |
| 메타데이터 상수화  | **완료**   | **완료**           | **완료**        | **완료**             | **완료**                   |
| 앵커 텍스트        | **개선됨** | -                  | -               | -                    | -                          |
| aria-label         | **추가됨** | -                  | -               | -                    | -                          |

## 📊 최적화 결과

| 항목                      | 변경 전                | 변경 후                        | 비고            |
| ------------------------- | ---------------------- | ------------------------------ | --------------- |
| BreadcrumbList 정확도     | 오류 (잘못된 name)     | 정상                           | 즉시 수정       |
| ItemList 구조화           | 미적용                 | 4개 퀴즈 목록 구조화           | 신규 추가       |
| primaryImageOfPage        | 1개 (image 문자열)     | 5개 (ImageObject 구조)         | 전체 추가       |
| 개별 퀴즈 url 필드        | 0개                    | 4개                            | 전체 추가       |
| 메타데이터 관리 방식      | 인라인 (각 ~30줄)      | 상수화 (각 1줄)                | 유지보수성 향상 |
| 메타데이터 코드 중복 제거 | 5개 파일에 ~150줄 중복 | `seoMetaData.ts` 1개 파일      | 약 120줄 감소   |
| Title 구체성              | 일반적 제목            | 퀴즈 종류·문제 수 명시         | P0 피드백 반영  |
| Description 구체성        | 추상적 설명            | 20문제·4지선다·결과 확인 명시  | P0 피드백 반영  |
| JSON-LD ↔ 메타 일관성    | 불일치                 | name·description 완전 동기화   | P0 피드백 반영  |
| 앵커 텍스트               | "시작하기 →" (동일)    | "{퀴즈명} 시작하기 →" (구체적) | P0 피드백 반영  |
| aria-label                | 미적용                 | 퀴즈 카드 Link에 추가          | 접근성 개선     |

## 🔧 기술적 세부사항

### 수정 파일 목록

| 파일                                          | 변경 내용                                                                                           |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/constants/quizJsonLd.ts`                 | BreadcrumbList 수정, ItemList 추가, primaryImageOfPage 추가, url 필드 추가, name·description 재작성 |
| `src/constants/seoMetaData.ts`                | 퀴즈 메타데이터 상수 5개 + 헬퍼 함수 추가, Title·Description 재작성                                 |
| `src/app/quiz/page.tsx`                       | 메타데이터 상수 import, ItemList script 태그 추가                                                   |
| `src/app/quiz/silhouette/page.tsx`            | 메타데이터 상수 import으로 교체                                                                     |
| `src/app/quiz/ability/page.tsx`               | 메타데이터 상수 import으로 교체                                                                     |
| `src/app/quiz/pokemon-type/page.tsx`          | 메타데이터 상수 import으로 교체                                                                     |
| `src/app/quiz/type-effectiveness/page.tsx`    | 메타데이터 상수 import으로 교체                                                                     |
| `src/views/desktop/quiz/QuizMain.desktop.tsx` | 앵커 텍스트 구체화, aria-label 추가                                                                 |
| `src/views/mobile/quiz/QuizMain.mobile.tsx`   | 앵커 텍스트 구체화, aria-label 추가                                                                 |

### `createQuizMetadata` 헬퍼 함수

`seoMetaData.ts`에 추가된 내부 헬퍼 함수로, 퀴즈 페이지의 공통 메타데이터 구조(title, description, robots, openGraph, alternates, twitter)를 생성합니다. 공통 상수(`SITE_NAME`, `SITE_URL`, `OG_IMAGE_URL`)를 사용하여 URL 하드코딩을 제거했습니다.

## ✅ 테스트 체크리스트

- [x] `quizJsonLd.ts` 문법 오류 없음
- [x] `seoMetaData.ts` 문법 오류 없음
- [ ] 메인 퀴즈 페이지(`/quiz`) BreadcrumbList 정상 렌더링 확인
- [ ] 메인 퀴즈 페이지(`/quiz`) ItemList JSON-LD 정상 렌더링 확인
- [ ] 각 퀴즈 페이지 메타데이터(title, description, OG, Twitter) 정상 출력 확인
- [ ] Google Rich Results Test로 구조화 데이터 검증

### 변경 8: 퀴즈 설명 콘텐츠 블록 추가 (P1 thin content 해소)

각 퀴즈별 SEO 텍스트 콘텐츠(300~500자)를 `quiz.constants.ts`에 상수로 정의하고, 메인 퀴즈 페이지와 개별 퀴즈 BeforeStage에 설명 섹션을 추가했습니다.

**추가된 상수**:

- `QUIZ_MAIN_SEO_CONTENT`: 메인 퀴즈 페이지 소개 텍스트 (2단락)
- `QUIZ_DESCRIPTION_LIST_DATA`: 4종 퀴즈별 설명 섹션 3개 (퀴즈 소개, 출제 유형, 난이도 안내) + 관련 페이지 링크
- `QUIZ_CROSS_LINKS`: 다른 퀴즈로의 교차 링크 데이터

**메인 퀴즈 페이지**: 퀴즈 카드 그리드 위에 전체 퀴즈 소개 텍스트 블록 추가

**개별 퀴즈 BeforeStage**: 기존 4줄 안내 리스트 아래에 3개 섹션 설명 콘텐츠 추가

| 퀴즈             | 설명 섹션                                                   |
| ---------------- | ----------------------------------------------------------- |
| 실루엣 퀴즈      | "실루엣 퀴즈?", "어떤 문제가 나오나요?", "난이도 안내"      |
| 특성 퀴즈        | "특성 퀴즈?", "어떤 문제가 나오나요?", "난이도 안내"        |
| 포켓몬 타입 퀴즈 | "포켓몬 타입 퀴즈?", "어떤 문제가 나오나요?", "난이도 안내" |
| 타입 상성 퀴즈   | "타입 상성 퀴즈?", "어떤 문제가 나오나요?", "난이도 안내"   |

**주요 영향 파일** (상수 1 + Desktop 5 + Mobile 5 = 11개):

- [src/constants/quiz.constants.ts](../../src/constants/quiz.constants.ts)
- [src/views/desktop/quiz/QuizMain.desktop.tsx](../../src/views/desktop/quiz/QuizMain.desktop.tsx)
- [src/views/mobile/quiz/QuizMain.mobile.tsx](../../src/views/mobile/quiz/QuizMain.mobile.tsx)
- Desktop BeforeStage 4개 (silhouette, ability, pokemonType, typeEffectiveness)
- Mobile BeforeStage 4개 (silhouette, ability, pokemonType, typeEffectiveness)

### 변경 9: 관련 페이지 내부 링크 확장 (P1 크롤링 경로 개선)

#### BeforeStage 내부 링크

각 퀴즈 BeforeStage에 두 종류의 내부 링크 블록을 추가했습니다:

| 퀴즈           | 관련 페이지 링크               | 교차 퀴즈 링크               |
| -------------- | ------------------------------ | ---------------------------- |
| 실루엣 퀴즈    | `/list` (포켓몬 도감)          | 특성, 타입, 타입 상성 퀴즈   |
| 특성 퀴즈      | `/ability` (특성 도감)         | 실루엣, 타입, 타입 상성 퀴즈 |
| 타입 퀴즈      | `/list` (포켓몬 도감)          | 실루엣, 특성, 타입 상성 퀴즈 |
| 타입 상성 퀴즈 | `/type-effectiveness` (계산기) | 실루엣, 특성, 타입 퀴즈      |

#### Result 내부 링크

`ResultFooter` 컴포넌트에 `quizType` props를 추가하여, 퀴즈 완료 후에도 관련 페이지 링크와 다른 퀴즈 링크를 표시합니다.

**주요 영향 파일** (ResultFooter 2 + Result 래퍼 8 = 10개):

- [src/container/desktop/quiz/components/result/ResultFooter.tsx](../../src/container/desktop/quiz/components/result/ResultFooter.tsx)
- [src/views/mobile/quiz/components/result/ResultFooter.tsx](../../src/views/mobile/quiz/components/result/ResultFooter.tsx)
- 각 퀴즈별 Result 래퍼 컴포넌트 8개 (Desktop 4 + Mobile 4)

### 변경 8~9 최적화 결과

| 항목                         | 변경 전            | 변경 후                                     |
| ---------------------------- | ------------------ | ------------------------------------------- |
| 메인 퀴즈 페이지 텍스트      | ~200자             | ~500자                                      |
| 개별 퀴즈 BeforeStage 텍스트 | ~80자 (4줄 리스트) | ~400자 (설명 3섹션 + 기존 리스트)           |
| 내부 링크 (BeforeStage)      | 0개                | 관련 페이지 1개 + 교차 퀴즈 3개             |
| 내부 링크 (Result)           | 퀴즈 메인 1개      | 관련 페이지 1개 + 교차 퀴즈 3개 + 기존 버튼 |
| 추가 수정 파일 수            | -                  | 21개                                        |

### 변경 10: BeforeStage/Result 컴포넌트 패턴 통일 (코드 리뷰 반영)

사용자 코드 리뷰 결과를 반영하여 실루엣 퀴즈 기준으로 나머지 3개 퀴즈의 BeforeStage와 Result 컴포넌트를 동일한 패턴으로 통일.

#### BeforeStage 패턴 통일

**구조 변경**:

- 기존: `article`(안내 리스트 + 시작 버튼) + `article`(설명 섹션 + relatedLinks) + `article`(다른 퀴즈 링크) → 3개 별도 블록
- 변경: `section`(h2 제목 + 설명 섹션 + 시작 버튼 + relatedLinks) + `OtherQuizLink` 컴포넌트 → 통합 블록 + 공유 컴포넌트

**세부 변경사항**:

- 인라인 `QUIZ_CROSS_LINKS` 렌더링 → `OtherQuizLink` 공유 컴포넌트 사용
- 링크 색상: `text-blue-600` → `text-primary-2` (프로젝트 디자인 시스템 준수)
- relatedLinks에서 `→` 접미사 제거 (상수 텍스트에 이미 포함)
- 각 퀴즈 h2 제목을 섹션 상단에 배치
- `quiz.constants.ts`에서 각 퀴즈 첫 번째 section title을 `''`로 변경 (h2로 이동됨)

#### Result 패턴 통일

**ResultFooter props 변경**:

- 기존: `quizType` (optional)
- 변경: `quizType` (required, `QuizType` 타입), `relationPageHref`, `relationPageHrefLabel` (required)
- `OtherQuizLink` 컴포넌트로 교차 퀴즈 링크 표시

| 퀴즈             | `relationPageHref`    | `relationPageHrefLabel` |
| ---------------- | --------------------- | ----------------------- |
| 실루엣 퀴즈      | `/list`               | 포켓몬 확인하러 가기    |
| 특성 퀴즈        | `/ability`            | 특성 도감 확인하기      |
| 포켓몬 타입 퀴즈 | `/list`               | 포켓몬 도감 확인하기    |
| 타입 상성 퀴즈   | `/type-effectiveness` | 타입 상성 계산기        |

**주요 영향 파일** (상수 1 + BeforeStage 6 + Result 6 + 공유 컴포넌트 2 + 타입 1 = 16개):

- `src/constants/quiz.constants.ts` - sections 첫 번째 title 빈 문자열로 변경
- `src/types/quiz.type.ts` - `QuizType` 타입 정의 (신규)
- Desktop/Mobile `OtherQuizLink` 컴포넌트 (신규, 사용자 생성)
- Desktop/Mobile `ResultFooter` 컴포넌트 (사용자 리팩토링)
- Desktop BeforeStage 3개 (ability, pokemonType, typeEffectiveness)
- Mobile BeforeStage 3개 (ability, pokemonType, typeEffectiveness)
- Desktop Result 3개 (ability, pokemonType, typeEffectiveness)
- Mobile Result 3개 (ability, pokemonType, typeEffectiveness)

### 변경 11: HowTo JSON-LD 구조화 데이터 추가

개별 퀴즈 4개 페이지에 HowTo 타입 JSON-LD를 추가하여 Google 검색 결과에서 단계별 리치 스니펫 노출 가능성 확보.

**추가된 HowTo 구조** (4개 퀴즈 공통 3단계):

| Step | name          | 설명                                    |
| ---- | ------------- | --------------------------------------- |
| 1    | 퀴즈 시작     | 시작하기 버튼으로 20문제 4지선다 시작   |
| 2    | (퀴즈별 상이) | 각 퀴즈 특성에 맞는 문제 풀이 방법 안내 |
| 3    | 결과 확인     | 점수, 정답률, 소요 시간 및 오답 확인    |

**퀴즈별 Step 2 차이점**:

| 퀴즈        | Step 2 name              | 핵심 내용                       |
| ----------- | ------------------------ | ------------------------------- |
| 실루엣      | 실루엣 보고 정답 선택    | 검은 실루엣 → 정답 포켓몬 선택  |
| 특성        | 특성 설명 읽고 정답 선택 | 특성 효과 설명 → 해당 특성 선택 |
| 포켓몬 타입 | 타입에 맞는 포켓몬 선택  | 제시된 타입 → 해당 포켓몬 선택  |
| 타입 상성   | 데미지 배수 선택         | 공격·방어 타입 조합 → 배수 선택 |

**주요 영향 파일** (상수 1 + page.tsx 4 = 5개):

- `src/constants/quizJsonLd.ts` - HowTo JSON-LD 상수 4개 추가
- `src/app/quiz/silhouette/page.tsx` - HowTo 스크립트 태그 추가
- `src/app/quiz/ability/page.tsx` - HowTo 스크립트 태그 추가
- `src/app/quiz/pokemon-type/page.tsx` - HowTo 스크립트 태그 추가
- `src/app/quiz/type-effectiveness/page.tsx` - HowTo 스크립트 태그 추가

### 변경 12: WebPage JSON-LD description 보강

개별 퀴즈 4개의 WebPage JSON-LD description을 `quiz.constants.ts`의 상세 설명 텍스트와 동기화하여 구조화 데이터의 콘텐츠 품질 향상.

**변경 전/후 비교**:

| 퀴즈        | 변경 전                                               | 변경 후                                                                                                                                           |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 실루엣      | 검은 실루엣만 보고 포켓몬 이름을 맞춰보세요!          | 실루엣 퀴즈는 검은 그림자로 가려진 포켓몬의 외형만 보고 어떤 포켓몬인지 맞추는 퀴즈입니다.                                                        |
| 특성        | 포켓몬 특성 설명을 보고 정답 특성을 골라보세요!       | 특성 퀴즈는 포켓몬 특성의 설명을 읽고 어떤 특성인지 맞추는 퀴즈입니다. 배틀에서 중요한 역할을 하는 특성들을 얼마나 잘 알고 있는지 테스트해보세요. |
| 포켓몬 타입 | 불꽃, 물, 풀 등 특정 타입을 가진 포켓몬을 골라보세요! | 포켓몬 타입 퀴즈는 특정 타입이 주어졌을 때, 해당 타입을 가진 포켓몬을 골라내는 퀴즈입니다.                                                        |
| 타입 상성   | 공격·방어 타입 조합의 데미지 배수를 맞춰보세요!       | 타입 상성 퀴즈는 공격 타입과 방어 타입의 조합을 보고 데미지 배수를 맞추는 퀴즈입니다. 포켓몬 배틀의 핵심인 타입 상성표를 확인해보세요.            |

**주요 영향 파일**: `src/constants/quizJsonLd.ts` (description 4건 변경)

## 📝 향후 작업

### P2 (장기 개선)

- OG 이미지 페이지별 분리 (현재 모든 퀴즈가 동일 ogImage.png 사용) → `feature/1.32.0-quiz-og-image`
- Schema.org Quiz 타입 지원 여부 모니터링 (현재 Google 미지원)

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
- 변경 6~7은 외부 SEO 리뷰 피드백의 P0(최우선) 항목을 반영한 것임
- 변경 8~9: 모바일 BeforeStage의 기존 `h-[20rem]` 고정 높이를 제거하여 설명 콘텐츠 추가 시 높이가 자연스럽게 늘어나도록 변경
- 변경 8~9: 설명 텍스트를 컴포넌트 내부가 아닌 `quiz.constants.ts`에 상수로 분리하여 관리 용이성 확보
- 변경 9: `ResultFooter`에 `quizType` props를 optional로 추가하여 기존 호출부에 영향 없음 (하위 호환성 유지)
