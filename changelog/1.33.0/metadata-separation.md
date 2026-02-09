# 메타데이터 분리 (metadata-separation)

## 📋 작업 개요

**브랜치**: `feature/1.33.0-metadata-separation`
**작업 유형**: 리팩토링
**작업 기간**: 2026-02-09
**담당**: Claude Code

## 🎯 작업 목표

각 `page.tsx` 파일에 인라인으로 작성된 `generateMetadata` 함수 및 정적 `metadata` 상수를 `_metadata/` 폴더로 분리하여 코드 응집도와 유지보수성을 향상시킵니다.

기존 `seoMetaData.ts`에 집중되어 있던 페이지별 메타데이터 상수들도 각 라우트의 `_metadata/` 폴더로 이동하여, `seoMetaData.ts`는 공통 헬퍼 함수(`createMetadata`)만 유지하도록 정리합니다.

## ✨ 주요 변경사항

### 변경 1: 동적 `generateMetadata` 함수 분리 (7개 페이지)

각 `page.tsx`에서 인라인으로 작성된 `generateMetadata` 로직을 `_metadata/` 폴더의 전용 모듈로 추출했습니다.

| 페이지 | 생성된 메타데이터 모듈 |
| --- | --- |
| `list/page.tsx` | `list/_metadata/generateListMetadata.ts` |
| `moves/page.tsx` | `moves/_metadata/generateMovesListMetadata.ts` |
| `ability/[id]/page.tsx` | `ability/[id]/_metadata/generateAbilityDetailMetadata.ts` |
| `moves/[id]/page.tsx` | `moves/[id]/_metadata/generateMoveDetailMetadata.ts` |
| `moves/[id]/generation/[generationId]/page.tsx` | 동일 파일 (generateMoveDetailGenerationMetadata) |
| `detail/[pokemonId]/moves/form/[[...index]]/page.tsx` | `detail/[pokemonId]/moves/_metadata/generateFormMovesMetadata.ts` |
| `detail/[pokemonId]/moves/region/[[...index]]/page.tsx` | 동일 파일 (generateRegionMovesMetadata) |

### 변경 2: 정적 메타데이터 상수 분리 (8개 페이지)

`seoMetaData.ts`에 있던 페이지별 메타데이터 상수들을 각 라우트의 `_metadata/` 폴더로 이동했습니다.

| 상수명 | 이동 경로 |
| --- | --- |
| `HOME_META` | `app/_metadata/homeMetadata.ts` |
| `ABILITY_LIST_META` | `app/ability/_metadata/abilityListMetadata.ts` |
| `TYPE_EFFECTIVENESS_META` | `app/type-effectiveness/_metadata/typeEffectivenessMetadata.ts` |
| `MOVES_MAIN_META` | `app/moves/_metadata/generateMovesListMetadata.ts` (로컬 상수) |
| `QUIZ_MAIN_META` | `app/quiz/_metadata/quizMetadata.ts` |
| `QUIZ_SILHOUETTE_META` | 동일 파일 |
| `QUIZ_ABILITY_META` | 동일 파일 |
| `QUIZ_POKEMON_TYPE_META` | 동일 파일 |
| `QUIZ_TYPE_EFFECTIVENESS_META` | 동일 파일 |

### 변경 3: `seoMetaData.ts` 정리

**변경 전**:
```typescript
// 13개의 메타데이터 상수 + createMetadata 헬퍼 + createMovesMetadata, createQuizMetadata 헬퍼
export const HOME_META = { ... }
export const ABILITY_LIST_META = { ... }
export const QUIZ_MAIN_META = { ... }
// ... 등등
```

**변경 후**:
```typescript
// 공통 헬퍼 함수만 유지
export const createMetadata = (
  title: string,
  description: string,
  path: string,
  imageAlt: string,
): Metadata => ({ ... })
```

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 | 개선 내용 |
| --- | --- | --- | --- |
| `seoMetaData.ts` 역할 | 13개 상수 + 3개 헬퍼 | 1개 헬퍼만 | 단일 책임 원칙 적용 |
| 인라인 메타데이터 페이지 | 14개 (58.4%) | 0개 (0%) | 전체 분리 완료 |
| 분리된 메타데이터 페이지 | 10개 (41.6%) | 24개 (100%) | 100% 커버리지 |
| 생성된 `_metadata` 모듈 | - | 10개 파일 | 라우트별 메타데이터 모듈화 |

## 🔧 기술적 세부사항

### 신규 생성 파일

- `src/app/_metadata/homeMetadata.ts`
- `src/app/ability/_metadata/abilityListMetadata.ts`
- `src/app/type-effectiveness/_metadata/typeEffectivenessMetadata.ts`
- `src/app/quiz/_metadata/quizMetadata.ts`
- `src/app/list/_metadata/generateListMetadata.ts`
- `src/app/moves/_metadata/generateMovesListMetadata.ts`
- `src/app/ability/[id]/_metadata/generateAbilityDetailMetadata.ts`
- `src/app/moves/[id]/_metadata/generateMoveDetailMetadata.ts`
- `src/app/detail/[pokemonId]/moves/_metadata/generateFormMovesMetadata.ts`

### 수정된 파일

- `src/constants/seoMetaData.ts` — 상수 제거, `createMetadata` 헬퍼만 유지
- `src/app/page.tsx` — `HOME_META` import 경로 변경
- `src/app/ability/page.tsx` — `ABILITY_LIST_META` import 경로 변경
- `src/app/type-effectiveness/page.tsx` — `TYPE_EFFECTIVENESS_META` import 경로 변경
- `src/app/list/page.tsx` — 인라인 `generateMetadata` → 모듈 import
- `src/app/moves/page.tsx` — 인라인 `generateMetadata` → 모듈 import
- `src/app/ability/[id]/page.tsx` — 인라인 `generateMetadata` → 모듈 import
- `src/app/moves/[id]/page.tsx` — 인라인 `generateMetadata` → 모듈 import
- `src/app/moves/[id]/generation/[generationId]/page.tsx` — 인라인 `generateMetadata` → 모듈 import
- `src/app/detail/[pokemonId]/moves/form/[[...index]]/page.tsx` — 인라인 `generateMetadata` → 모듈 import
- `src/app/detail/[pokemonId]/moves/region/[[...index]]/page.tsx` — 인라인 `generateMetadata` → 모듈 import
- `src/app/quiz/page.tsx` — `QUIZ_MAIN_META` import 경로 변경
- `src/app/quiz/silhouette/page.tsx` — `QUIZ_SILHOUETTE_META` import 경로 변경
- `src/app/quiz/ability/page.tsx` — `QUIZ_ABILITY_META` import 경로 변경
- `src/app/quiz/pokemon-type/page.tsx` — `QUIZ_POKEMON_TYPE_META` import 경로 변경
- `src/app/quiz/type-effectiveness/page.tsx` — `QUIZ_TYPE_EFFECTIVENESS_META` import 경로 변경

## ✅ 테스트 체크리스트

- [x] ESLint 검사 통과 (신규 에러 없음)
- [x] 프로덕션 빌드 성공
- [ ] 각 페이지 메타데이터 렌더링 확인
- [ ] OG 태그 정상 출력 확인
- [ ] 퀴즈 페이지 5개 메타데이터 확인
- [ ] canonical URL 정상 생성 확인

## 📝 향후 작업

- `src/module/generateDetailSeoMetaData.ts`도 `detail/[pokemonId]/_metadata/` 폴더로 이동 검토
- `seoMetaData.ts`에서 `createMetadata` 헬퍼의 위치를 `src/module/metadata.module.ts`로 통합 검토

## 🚀 머지 정보

**머지 대상**: `feature/1.33.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- `homeMetadata.ts`는 커스텀 `robots` 설정(googleBot `max-image-preview: 'large'`)이 포함되어 있어 `createMetadata` 헬퍼를 사용하지 않고 직접 Metadata 객체를 정의합니다.
- `moves/[id]/_metadata/generateMoveDetailMetadata.ts`에는 기술 상세와 세대별 기술 상세 두 개의 메타데이터 생성 함수가 함께 위치합니다.
- `detail/[pokemonId]/moves/_metadata/generateFormMovesMetadata.ts`에는 폼체인지와 리전폼 두 개의 메타데이터 생성 함수가 함께 위치합니다.
