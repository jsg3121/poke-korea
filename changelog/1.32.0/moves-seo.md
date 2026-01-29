# 기술 도감 페이지 SEO 개선 (moves-seo)

## 📋 작업 개요

**브랜치**: `feature/1.32.0-moves-seo`
**작업 유형**: SEO 개선
**작업 기간**: 2026-01-29
**담당**: Claude Code

## 🎯 작업 목표

기술 도감(`/moves`) 페이지의 SEO를 강화하여 검색엔진 노출과 클릭률(CTR)을 개선합니다.
퀴즈 페이지(1.32.0-quiz-seo)에서 적용한 패턴을 기술 도감에도 동일하게 적용합니다.

## ✨ 주요 변경사항

### 변경 1: JSON-LD `image` → `primaryImageOfPage` ImageObject 구조 변경

**변경 전**:
```typescript
image: 'https://poke-korea.com/assets/image/ogImage.png'
```

**변경 후**:
```typescript
primaryImageOfPage: {
  '@type': 'ImageObject',
  url: 'https://poke-korea.com/assets/image/ogImage.png',
  width: 1200,
  height: 630,
}
```

**적용 대상**: 목록 페이지(`MOVES_WEBPAGE_JSON_LD`), 상세 페이지(`getMoveDetailJsonLd`), 세대별 상세 페이지(`getMoveDetailGenerationJsonLd`)

**주요 영향 파일**:
- [movesJsonLd.ts](../../src/constants/movesJsonLd.ts)

### 변경 2: Title/Description 구체성 강화

**변경 전** (목록 페이지):
```
제목: "포켓몬 기술 도감 - 포케코리아"
설명: "1세대부터 9세대까지 900개 이상의 포켓몬 기술을 한곳에서 확인하세요..."
```

**변경 후** (목록 페이지):
```
제목: "포켓몬 기술 도감 (1~9세대 전체) | 포케 코리아"
설명: "1세대부터 9세대까지 900개 이상의 포켓몬 기술을 타입·데미지 유형별로 검색하세요. 위력, 명중률, 배울 수 있는 포켓몬까지 한눈에 확인할 수 있습니다."
```

**변경 전** (상세 페이지):
```
제목: "포켓몬 10만볼트 기술 정보 - 포케 코리아"
```

**변경 후** (상세 페이지):
```
제목: "10만볼트 - 전기 특수 기술 (위력 90 · 명중 100) | 포켓몬 기술 도감"
```

**주요 영향 파일**:
- [moves/page.tsx](../../src/app/moves/page.tsx)
- [moves/[id]/page.tsx](../../src/app/moves/[id]/page.tsx)
- [moves/[id]/generation/[generationId]/page.tsx](../../src/app/moves/[id]/generation/[generationId]/page.tsx)

### 변경 3: 타입별 ItemList JSON-LD 추가

18가지 포켓몬 타입별 필터 페이지를 `ItemList` 구조화 데이터로 추가하여 리치 스니펫 노출 가능성을 높임.

```typescript
export const MOVES_TYPE_ITEMLIST_JSON_LD = {
  '@type': 'ItemList',
  name: '포켓몬 기술 타입별 목록',
  numberOfItems: 18,
  itemListElement: [
    { position: 1, name: '노말 타입 기술', url: '.../moves?typeFilter=NORMAL' },
    { position: 2, name: '불꽃 타입 기술', url: '.../moves?typeFilter=FIRE' },
    // ... 18개 타입
  ],
}
```

**주요 영향 파일**:
- [movesJsonLd.ts](../../src/constants/movesJsonLd.ts)
- [moves/page.tsx](../../src/app/moves/page.tsx)

### 변경 4: 메타데이터 상수화

필터 없는 기본 기술 도감 메타데이터를 `MOVES_MAIN_META` 상수로 추출하여 관리.
퀴즈 페이지의 `createQuizMetadata` 패턴과 동일하게 `createMovesMetadata` 헬퍼 함수 추가.

**주요 영향 파일**:
- [seoMetaData.ts](../../src/constants/seoMetaData.ts)
- [moves/page.tsx](../../src/app/moves/page.tsx)

### 변경 5: JSON-LD script id 수정

기존에 잘못 지정되어 있던 `id="type-effectiveness-webpage-jsonLd"`를 `id="moves-webpage-jsonLd"`로 수정.

**주요 영향 파일**:
- [moves/page.tsx](../../src/app/moves/page.tsx)

## 🔧 기술적 세부사항

### 수정된 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/constants/movesJsonLd.ts` | `image` → `primaryImageOfPage` ImageObject, `MOVES_TYPE_ITEMLIST_JSON_LD` 추가 |
| `src/constants/seoMetaData.ts` | `createMovesMetadata` 헬퍼, `MOVES_MAIN_META` 상수 추가 |
| `src/app/moves/page.tsx` | 상수화된 메타데이터 사용, ItemList JSON-LD 렌더링 추가, script id 수정 |
| `src/app/moves/[id]/page.tsx` | title/description 구체성 강화, `getDamageTypeKorean` import 추가 |
| `src/app/moves/[id]/generation/[generationId]/page.tsx` | title/description 구체성 강화, `getDamageTypeKorean` import 추가 |

## ✅ 테스트 체크리스트

- [ ] `/moves` 페이지 메타데이터 정상 출력 확인
- [ ] `/moves?typeFilter=FIRE` 등 필터 페이지 메타데이터 정상 출력 확인
- [ ] `/moves/{id}` 상세 페이지 title에 타입/위력/명중률 포함 확인
- [ ] `/moves/{id}/generation/{genId}` 세대별 페이지 title 정상 확인
- [ ] JSON-LD 구조화 데이터 Google Rich Results Test 통과 확인
- [ ] ItemList JSON-LD가 `/moves` 페이지 소스에 정상 포함 확인
- [ ] ESLint 린트 통과 (기존 codegen 관련 오류 외 신규 오류 없음)

## 📝 향후 작업

- FAQPage 스키마 추가 검토 (기술을 배우는 포켓몬, 세대별 변경 이력 등)
- 데미지 유형별(물리/특수/변화) ItemList 추가 검토

## 🚀 머지 정보

**머지 대상**: `feature/1.32.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- 퀴즈 페이지 SEO 개선(`feature/1.32.0-quiz-seo`)과 동일한 패턴 적용
- GraphQL codegen 미실행 시 기존 `import/no-unresolved` 린트 오류 발생 (기존 이슈)
- `damageType` 필드는 영문(`physical`, `special`, `status`)으로 저장되어 있어 `getDamageTypeKorean` 유틸 사용
