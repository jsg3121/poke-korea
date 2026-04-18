---
name: seo-audit
description: |
  SEO 감사 스킬. 메타태그, 헤딩 구조, 시맨틱 마크업, JSON-LD, hreflang, canonical, OG 태그를 검사하고 개선점을 보고한다.
  TRIGGER when: "SEO 검사", "SEO 감사", "SEO 체크", "메타태그 확인", "구조화 데이터 확인" 요청, 특정 페이지 SEO 상태 점검 필요
  DO NOT TRIGGER when: SEO 설계/구현(seo-specialist 에이전트 사용), 접근성 검사(a11y-check 사용), 새 SEO 랜딩 페이지 생성
disable-model-invocation: true
---

# SEO 감사 스킬

ConfigDeck의 SEO 가이드라인(`.claude/seo/`) 준수 여부를 검사하고 개선점을 보고한다.

## 검사 프로세스

### 1. 대상 선택

사용자가 특정 페이지를 지정하지 않으면, `src/pages/` 하위 모든 `.astro` 페이지를 검사한다.

### 2. 검사 항목

#### 메타태그 (.claude/seo/guides/meta-tags.md 기준)

- `<title>` 존재 및 60자 이내 여부
- `<meta name="description">` 존재 및 120~160자 여부
- `<link rel="canonical">` 존재 여부
- 각 페이지의 title/description이 고유한지 (중복 검출)

#### Open Graph / Twitter Card

- `og:title`, `og:description`, `og:type`, `og:url`, `og:image` 존재 여부
- `twitter:card`, `twitter:title` 존재 여부
- OG 이미지 URL이 유효한지

#### 다국어 (hreflang)

- hreflang 태그 존재 여부
- 자기 참조(self-referencing) 포함 여부
- 양방향 참조 (en→ko, ko→en) 쌍 확인
- `x-default` 지정 여부

#### 시맨틱 구조 (.claude/seo/guides/semantic-html.md 기준)

- `<h1>` 페이지당 하나만 존재하는지
- heading 계층이 순차적인지 (h1→h2→h3)
- `<main>` 태그 존재 여부
- 의미 없는 `<div>` 래퍼가 시맨틱 태그를 대체하는 곳

#### 구조화 데이터 (.claude/seo/guides/structured-data.md 기준)

- JSON-LD `<script type="application/ld+json">` 존재 여부
- 페이지 유형별 적절한 스키마 적용 여부:
  - 홈: `WebApplication`
  - 파일별 랜딩: `FAQPage` (FAQ 섹션이 있는 경우)
  - 블로그: `Article` 또는 `HowTo`
- JSON-LD 문법 유효성

#### 기타

- `<img>` 태그의 `alt` 속성
- 내부 링크의 유효성 (존재하지 않는 페이지 참조)
- `robots.txt` 및 `sitemap.xml` 존재 여부

### 3. 결과 보고

```markdown
## SEO 감사 결과

### 요약
- 검사 페이지: {N}개
- 🔴 필수 수정: {N}건
- 🟡 권장 개선: {N}건
- ✅ 양호: {N}건

### 🔴 필수 수정

#### [{페이지 경로}] {이슈}
- **기준**: {어떤 가이드라인 위반인지}
- **현재**: {현재 상태}
- **수정**: {구체적 수정 방법}

### 🟡 권장 개선

- {페이지}: {개선 내용}

### 페이지별 상세

| 페이지 | title | description | canonical | hreflang | OG | JSON-LD | h1 |
|--------|-------|-------------|-----------|----------|----|---------|----|
| /en/ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /en/files/eslint | ✅ | ❌ 없음 | ✅ | ✅ | 🟡 이미지 없음 | ❌ 없음 | ✅ |
```

## 참고 자료

- `.claude/seo/guides/meta-tags.md`
- `.claude/seo/guides/semantic-html.md`
- `.claude/seo/guides/structured-data.md`
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
