---
slug: service-docs
title: '지표 문서를 없애고 지표 분석 스킬로 그 시점에 조회'
description: '2026-05 수치를 10월 분석까지 현재 지표로 제공하던 지표 문서 2종을 지우고, GA4·Search Console·애드센스·BigQuery를 그 시점에 조회하는 지표 분석 스킬과 BigQuery 연동을 추가했다.'
authors: [jsg3121, claude]
tags: [docs]
---

# 지표 문서를 없애고 지표 분석 스킬로 그 시점에 조회

> **작업 날짜**: 2026-11-03
> **브랜치**: `feature/1.62.5-service-docs`

## 📋 작업 개요

**작업 유형**: 문서 / 하네스 정리
**담당**: jsg3121, Claude

## 🎯 작업 목표

분석·기획에 쓰는 지표가 항상 조회 시점의 최신 값이 되게 한다. 저장소에는 지표를 옮겨 적지 않고, 필요할 때 API로 조회하는 절차를 하네스에 둔다.

<!-- truncate -->

## 📉 왜 필요했나

- **지표 문서가 5개월째 그대로였다.** `specs/service/metrics-baseline.md`와 `service-overview.md`는 2026-05-03 측정값(MAU 23,047)을 "현재 지표"로 담고 있었다. 9월 MAU는 53,310으로 2배 넘게 늘었지만 문서는 갱신되지 않았다. 10월 기획 때는 트래픽 스냅샷을 따로 만들어 "metrics-baseline은 낡았다"는 경고를 붙여야 했다.
- **서비스 소개도 사실과 달랐다.** `service-overview.md`의 "주요 기능"에는 실제로 없는 데미지 계산기·능력치 계산기가 있었고, 9월 30일이 기한인 성장 목표가 그대로 남아 있었다.
- **분석 에이전트에게는 그 문서가 유일한 수치 출처였다.** `market-intelligence`·`business-analyst`·`strategy-planner`·`product-planner`는 `tools`에 Bash가 없어 API 스크립트를 실행할 수 없다. 그래서 정의 문서가 가리키는 지표 문서를 읽을 수밖에 없었다.

## ✨ 주요 변경사항

### 변경 1: BigQuery(GA4 Export) 조회 스크립트 추가

GA4는 2026-10-14부터 BigQuery로 원본 이벤트를 내보내고 있었지만 조회 수단이 없었다. `.claude/analyzer/scripts/bigquery.js`를 추가했다.

- 기존 스크립트처럼 외부 의존성 없이 서비스 계정 토큰으로 호출한다
- 실행 전에 항상 dry run으로 스캔량을 출력하고, `maximumBytesBilled`(기본 1GB)를 넘는 쿼리는 BigQuery가 거부한다
- SQL의 `{{dataset}}`을 `프로젝트.데이터셋`으로 치환한다

`analyzer/index.md`에 데이터셋·수집 시작일·사전 준비·사용법과 함께, **표준 지표는 GA4 Data API로, 원본 이벤트 분석만 BigQuery로** 한다는 구분을 적었다. BigQuery로 사용자·세션을 다시 세면 GA4 화면 수치와 어긋날 수 있기 때문이다.

### 변경 2: 지표 분석 스킬 `/metrics-analysis` 추가

| 파일 | 내용 |
| --- | --- |
| `SKILL.md` | 질문 정리 → 소스 선택 → 조회 → 해석 → 보고 절차, 배포 전후 비교 방법, 에이전트에 넘기는 형식 |
| `references/queries.md` | 규모·유입·검색·수익·커스텀 이벤트별 조회 명령 |
| `references/interpretation.md` | 필터 변경 PV 부풀림, "(not set)" 세션, 부분 기간, Search Console 범위, CTR과 순위 등 |

배포 전후 비교도 저장해 둔 기준값을 쓰지 않고, 비교할 때 두 기간을 각각 조회한다.

### 변경 3: 지표는 메인 세션이 조회해 에이전트에 전달

화면 분석에서 캡처를 메인 세션이 맡는 것과 같은 구조로 정했다.

- `agents/index.md`: "지표는 메인 세션이 그 시점에 조회해 전달한다" 공통 규칙
- `market-intelligence`·`business-analyst`·`strategy-planner`·`product-planner`: 전달받은 수치만 현재값으로 쓰고, 없으면 "지표 미제공"으로 표시
- `biz-strategy`: Step 0 지표 조회 추가, 서비스 기본 정보(URL·수익 모델) 이관
- `specs/index.md`: `service/`에는 지표를 두지 않는다
- `CLAUDE.md`: 참조 표에 지표 분석·조회 스크립트 반영

### 변경 4: 지표 문서 2종 삭제

`specs/service/service-overview.md`, `specs/service/metrics-baseline.md`를 삭제했다. 살릴 내용은 위 스킬·지침으로 옮겼다.

## ⚠️ 구현 시 고려한 점

- **기능 목록도 옮기지 않았다.** 지표와 마찬가지로 목록은 반드시 낡는다. 기능 현황은 `src/app/` 라우트로 확인하도록 했다.
- **기획서·계획서의 옛 참조는 고치지 않았다.** `specs/features/` 4곳과 `specs/plans/` 2곳이 삭제된 문서를 언급하지만, 당시 판단 근거를 남긴 기록이라 그대로 두었다. `research/` 보고서와 ADR-0005도 같다.
- **조회 결과를 파일로 남기지 않는다.** 결과는 기본적으로 대화로 보고하고, 문서로 남길 때는 조회일을 적어 시점 기록임을 밝힌다.

## 🔍 검증

- `bigquery.js`: dry run, 실제 실행, 상한 초과 거부, SQL 누락 안내 4가지 경우를 실행해 확인했다
- `references/queries.md`와 `analyzer/index.md`의 조회 명령은 모두 실제로 실행해 결과가 나오는 것을 확인했다
- `prettier --check CLAUDE.md` 통과
- 삭제한 두 문서를 참조하는 하네스 문서(에이전트·스킬·색인·CLAUDE.md)가 남아 있지 않음을 grep으로 확인했다. 남은 언급은 삭제 이유를 설명하는 Why 문장과 과거 기록뿐이다
- **확인하지 않은 것**: 새 규칙대로 `biz-strategy`를 실제로 실행해 보지는 않았다
