# 퀴즈 페이지 SEO 개선 (quiz-seo)

## 📋 작업 개요

**브랜치**: `feature/1.32.0-quiz-seo`
**작업 유형**: SEO / 버그 수정
**작업 기간**: 2026-01-29
**담당**: Claude Code

## 🎯 작업 목표

퀴즈 페이지(5개)의 SEO 설정을 점검하고, 발견된 오류를 수정하며 중단기 개선 방향을 수립한다.

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

**주요 영향 파일**:

- [src/constants/quizJsonLd.ts](../../src/constants/quizJsonLd.ts)

## 🔍 SEO 분석 결과

### 현재 퀴즈 페이지 SEO 현황

| 항목 | `/quiz` | `/quiz/silhouette` | `/quiz/ability` | `/quiz/pokemon-type` | `/quiz/type-effectiveness` |
| ---- | ------- | ------------------ | --------------- | -------------------- | -------------------------- |
| Title | O | O | O | O | O |
| Description | O | O | O | O | O |
| Canonical URL | O | O | O | O | O |
| OpenGraph | O | O | O | O | O |
| Twitter Card | O | O | O | O | O |
| JSON-LD | O | O | O | O | O |
| Breadcrumb | **수정됨** | O | O | O | O |

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 | 비고 |
| ---- | ------- | ------- | ---- |
| BreadcrumbList 정확도 | 오류 (잘못된 name) | 정상 | 즉시 수정 완료 |

## 🔧 기술적 세부사항

**수정 파일**: `src/constants/quizJsonLd.ts` (175번째 줄)
**수정 내용**: `QUIZ_WEBPAGE_JSON_LD` 상수의 BreadcrumbList position 2 name 값 수정

## ✅ 테스트 체크리스트

- [x] `quizJsonLd.ts` 문법 오류 없음
- [ ] 메인 퀴즈 페이지(`/quiz`) BreadcrumbList 정상 렌더링 확인
- [ ] Google Rich Results Test로 구조화 데이터 검증

## 📝 향후 작업 (중단기 개선 체크리스트)

아래 항목들은 별도 작업으로 진행 예정:

- [ ] `getRobotsConfig()`에 `googleBot` 설정 추가
- [ ] 메인 퀴즈 JSON-LD에 `ItemList` 추가 (4가지 퀴즈 종류 구조화)
- [ ] 모든 퀴즈 JSON-LD에 `primaryImageOfPage` 추가
- [ ] 퀴즈 메타데이터 상수를 `seoMetaData.ts`로 일괄 이관
- [ ] 개별 퀴즈 JSON-LD에 `url` 필드 추가 (현재 메인만 있음)

## 🚀 머지 정보

**머지 대상**: `feature/1.32.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- 기본 SEO 설정(title, description, canonical, OG, Twitter Card)은 모든 퀴즈 페이지에 정상 적용되어 있음
- 개별 퀴즈 4개 페이지의 BreadcrumbList는 정상 (3단계: 홈 > 퀴즈 > 각 퀴즈)
- 오류는 메인 퀴즈 페이지(`QUIZ_WEBPAGE_JSON_LD`)에만 존재했음
