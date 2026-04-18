# ADR-0001: 하네스 엔지니어링 도입

- **상태**: 승인
- **날짜**: 2026-04-06
- **담당**: jsg3121, claude

## 맥락

poke-korea 프로젝트의 Claude Code 활용이 확대되면서, 단일 CLAUDE.md 파일에 모든 지침을 담는 방식의 한계가 드러남:
- CLAUDE.md가 비대해져 컨텍스트 윈도우를 과도하게 점유
- 커스텀 명령어(commands/)만으로는 자동화 범위가 제한적
- 에이전트, 스킬, hooks 등 고급 하네스 기능 미활용

## 결정

`.claude/` 디렉토리를 중심 허브로 재구성하여 하네스 엔지니어링 체계를 도입한다.

1. **CLAUDE.md 슬림화**: 핵심 요약만 남기고 상세 규칙은 `.claude/conventions/`, `.claude/seo/`로 분리
2. **에이전트 도입**: seo-specialist, ui-publisher, graphql-specialist 3개 도메인 전문 에이전트
3. **스킬 확장**: 기존 commands/ 4개를 skills/로 이전하고 lint-check, seo-audit, code-review, component-builder, research 5개 추가
4. **Hooks 자동화**: PostToolUse(자동 포맷팅), PreToolUse(위험 명령어 차단), Stop(changelog 검증), Notification(대기 알림)
5. **ADR 도입**: 향후 기술적 의사결정을 체계적으로 기록

## 근거

configDeck 프로젝트(`github.com/jsg3121/configDeck`)에서 검증된 하네스 구조를 참고하되, poke-korea 프로젝트 특성(Next.js, GraphQL, SEO 중심)에 맞게 재구성.

- **Progressive Disclosure**: 필요한 문서만 참조하여 컨텍스트 윈도우 효율화
- **Why-First 원칙**: 모든 규칙에 이유를 명시하여 엣지 케이스 판단 가능
- **스킬/에이전트 이중 레이어**: 단일 작업(스킬) vs 도메인 전문가(에이전트) 구분

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| CLAUDE.md 단일 파일 유지 | 간단함 | 컨텍스트 비효율, 확장 한계 | 이미 비대해진 상태 |
| configDeck 구조 그대로 적용 | 검증됨 | 기술 스택 차이(Astro vs Next.js) | 프로젝트 특성에 맞는 커스터마이징 필요 |

## 결과

- CLAUDE.md 토큰 사용량 대폭 감소 (필요 시에만 상세 문서 참조)
- 파일 수정 시 자동 포맷팅, 위험 명령어 차단 등 안전장치 확보
- 도메인별 전문 에이전트로 작업 품질 향상
- ADR을 통한 의사결정 추적 가능

## 참고 자료

- configDeck 하네스 구조: `github.com/jsg3121/configDeck`
- Claude Code Hooks 공식 문서
