# research/

조사·분석 보고서를 관리하는 폴더입니다.

유형별로 폴더를 나눕니다. 배치 규칙은 [`../conventions/guides/structure.md`](../conventions/guides/structure.md)가 권위 원본입니다.

## 하위 구조

| 폴더        | 담는 것                   | 산출 주체                                    |
| ----------- | ------------------------- | -------------------------------------------- |
| `market/`   | 시장·경쟁사·트렌드 조사   | `market-intelligence` 에이전트               |
| `business/` | 경쟁력·포지셔닝 분석      | `business-analyst` 에이전트                  |
| `strategy/` | 전략 방향·실행 우선순위   | `strategy-planner` 에이전트                  |
| `ux/`       | UX 설계·디자인 비평       | `ux-designer` 에이전트                       |
| `tech/`     | 기술 리서치·레퍼런스 조사 | `/research` 스킬                             |
| `seo/`      | SEO 감사                  | `/seo-audit` 스킬, `seo-specialist` 에이전트 |

## 파일명

`YYYY-MM-DD-<주제>.md` 형식을 쓴다.

> **Why 날짜인가:** 순번(`-001`)은 다음 번호를 알려면 전체 목록을 봐야 하고, 두 세션이 같은 번호를 쓸 수 있다. 조사 보고서는 시점이 곧 유효성의 단서라 날짜가 더 유용하다.

폴더가 이미 유형을 말하므로 파일명에 `MI-`·`UX-` 같은 접두사를 새로 붙이지 않는다.

## 보고서와 기획서의 구분

**`research/`는 "무엇을 알아냈는가"**, **`specs/`는 "무엇을 만들 것인가"**를 담는다.

조사 결과가 기능 구현으로 이어지면 `specs/features/`에 기획서를 따로 쓰고, 보고서는 그 근거로 링크한다. 한 문서가 조사와 기획을 겸하면 조사 부분이 갱신될 때 기획까지 흔들린다.

## 관련 문서

- 파이프라인 실행: [`../skills/biz-strategy/SKILL.md`](../skills/biz-strategy/SKILL.md) — MI → BA → STR 순차 실행
- 에이전트 정의: [`../agents/index.md`](../agents/index.md)
