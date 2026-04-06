# agents/

도메인 전문 에이전트를 정의하는 폴더입니다.

| 에이전트 | 역할 |
|----------|------|
| `seo-specialist.md` | SEO 전문가 — 메타태그, JSON-LD, OG 이미지, sitemap |
| `ui-publisher.md` | UI 구현 전문가 — 컴포넌트 구현, desktop/mobile 분리 패턴 |
| `graphql-specialist.md` | GraphQL 전문가 — 쿼리/스키마 변경, codegen 관리 |

## 에이전트 협업 패턴

- **새 페이지 추가**: ui-publisher → seo-specialist (구현 후 SEO 적용)
- **API 변경**: graphql-specialist → ui-publisher (스키마 변경 후 UI 반영)
- **SEO 개선**: seo-specialist 단독
- **동시 조사**: 여러 에이전트 병렬 (Fan-out/Fan-in)
