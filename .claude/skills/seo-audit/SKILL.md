SEO 관련 메타태그, JSON-LD, sitemap 등을 감사하고 결과를 보고해줘.

## 입력

- 대상 경로: $ARGUMENTS (인자가 없으면 전체 페이지 감사)

## 실행 절차

1. `.claude/seo/guides/seo.md` 가이드를 참조하여 검사 기준 확인
2. 대상 페이지의 `page.tsx` 파일에서 metadata/generateMetadata 확인
3. JSON-LD 구조화 데이터 존재 여부 확인
4. canonical URL 설정 확인
5. OG/Twitter Card 태그 확인
6. `src/app/sitemap.ts`에 URL 패턴 포함 여부 확인

## 검사 항목

| 항목 | 기준 |
|------|------|
| title | 60자 이내, 페이지별 고유 |
| description | 120~160자, 키워드 포함 |
| canonical URL | Path 기반, 중복 없음 |
| OG tags | title, description, image, url 필수 |
| Twitter Card | summary_large_image 타입 |
| JSON-LD | 해당 페이지 유형에 맞는 스키마 |
| sitemap | 새 URL 패턴 반영 여부 |
| robots | 환경별 분기 (프로덕션: index/follow) |

## 출력 형식

```
## SEO 감사 결과

### ✅ 통과 항목
- {항목}: {상태}

### ⚠️ 개선 권장
- {항목}: {현재 상태} → {권장 사항}

### ❌ 누락 항목
- {항목}: {설명}

## 요약
- 통과: {N}건
- 개선 권장: {N}건
- 누락: {N}건
```

## 주의사항

- 코드를 바로 수정하지 않는다. 감사 결과만 보고한다.
- seo-specialist 에이전트와 협업이 필요한 경우 안내한다.
