SEO 관련 메타태그, JSON-LD, sitemap 등을 감사하고 결과를 보고해줘.

## 입력

- 대상 경로: $ARGUMENTS (인자가 없으면 전체 페이지 감사)

## 실행 절차

1. `.claude/seo/guides/seo.md` 가이드를 참조하여 검사 기준 확인
2. 대상 페이지의 `page.tsx`에서 metadata/generateMetadata 확인
3. JSON-LD, canonical URL, OG/Twitter Card, sitemap, robots 확인
4. 통과 / 개선 권장 / 누락으로 분류하여 보고

## 검사 기준

title 60자 이내, description 120~160자, canonical URL, OG tags 4종, Twitter Card, JSON-LD, sitemap 반영, robots 환경별 분기

## 주의사항

- 코드를 바로 수정하지 않는다. 감사 결과만 보고한다.
