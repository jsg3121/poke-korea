---
slug: research-docs
title: '사용자 유입 증대 분석 보고서 및 실행 계획서 추가'
description: 'GA4·네이버 서치어드바이저 실측 데이터 기반으로 시장 환경(MI), 내부 역량(BA), 실행 전략(STR) 3종 보고서와 실행 계획서를 작성했습니다.'
authors: [jsg3121, claude]
tags: [research, planning, seo]
---

# 사용자 유입 증대 분석 보고서 및 실행 계획서 추가

> **작업 날짜**: 2026-05-04
> **브랜치**: `feature/1.39.0-research-docs`

## 작업 개요

**작업 유형**: 분석/기획 (코드 변경 없음)
**담당**: Claude (market-intelligence, business-analyst, strategy-planner 에이전트)

## 작업 목표

포케코리아의 사용자 유입 증대를 위한 비즈니스 전략 분석을 진행하고, 후속 코드 작업에 인계할 실행 계획서를 작성합니다. GA4 + 네이버 서치어드바이저 실측 데이터를 기반으로 시장 환경, 내부 역량, 실행 전략을 단계적으로 분석합니다.

<!-- truncate -->

## 주요 변경사항

### 1. 분석 보고서 3종 (MI → BA → STR 파이프라인)

| 보고서 | 내용 | 주요 발견 |
| --- | --- | --- |
| **MI** (Market Intelligence) | 한국 포켓몬 시장 규모, 경쟁사(OP.GG, 나무위키, 포케모음 등), 검색 채널 특성, 신규 유입 채널 기회 | OP.GG 챔피언스 진입이 최대 단기 위협, 챔피언스 모바일 출시(2026 여름)가 최대 기회 |
| **BA** (Business Analyst) | MI 결과 + 코드베이스 + 지표 대조 SWOT 분석, 유입 병목 TOP 5, 차별화 포인트 재정의 | 챔피언스 상세 페이지는 이미 구현됨 (v3 정정), 진짜 문제는 메타 description boilerplate |
| **STR** (Strategy Planner) | MI+BA 종합 후 시간축별(QW/ST/MT) 실행 항목, KPI, 리스크, 첫 2주 액션 리스트 | 3축 동시 실행: 즉시 메타 최적화 + 챔피언스 인덱싱 품질 개선 + 특수 폼 콘텐츠 확장 |

### 2. 핵심 지표 기준값 갱신 (`metrics-baseline.md`)

GA4 + 네이버 서치어드바이저 실측 데이터 반영:

- **MAU 23,047**, DAU/MAU 4.2%, 검색 유입 비중 83%
- **검색 CTR 2.29%, 평균 순위 6.8** (네이버 SC 7일 기준)
- 페이지별 트래픽 Top 10, 디바이스/브라우저 분포
- 네이버 SC 키워드 TOP 10, 페이지 TOP 10 (이로치/메가진화 키워드 강세 발견)

### 3. 실행 계획서 (`traffic-growth-implementation-plan.md`)

STR 보고서 권고안을 단계별 작업 항목으로 분해 (총 20개 항목):

- **단계 A**: 즉시 실행 (5개, 1일 이내)
- **단계 B**: 메타 다양화 (3개, 1~3일)
- **단계 C**: 프론트 UI/구조 (5개, 3~7일)
- **단계 D**: 프론트 데이터 검토 (1개, 1~2주)
- **단계 E**: 백엔드 협업 (3개, 2~4주)
- **단계 F**: 운영/외부 (2개)
- **단계 G**: 보류 (1개)

각 항목별로 파일 경로, 공수, 백엔드 의존 여부, STR 연관 항목 명시.

### 4. 워크플로우 가이드 보강 (`workflow.md`)

분석/기획 작업도 기능 개발의 일부로 간주하여 동일 버전 루트 아래에 묶는 패턴을 예시로 추가.

## 기술적 세부사항

### 신규/수정된 파일

| 파일 | 유형 |
| --- | --- |
| `.claude/research/reports/MI-2026-05-04-poke-korea-traffic-growth.md` | 신규 |
| `.claude/research/reports/BA-2026-05-04-poke-korea-competitiveness.md` | 신규 (v3) |
| `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` | 신규 (v3) |
| `.claude/specs/traffic-growth-implementation-plan.md` | 신규 |
| `.claude/specs/metrics-baseline.md` | 갱신 (PDF + 네이버 SC 데이터 반영) |
| `.claude/specs/service-overview.md` | 갱신 (URL + 핵심 지표 반영) |
| `.claude/conventions/guides/workflow.md` | 갱신 (분석/기획 작업 패턴 예시 추가) |

### 6개월 KPI 목표 (STR 보고서 v3 기준)

| 지표 | 현재값 (2026-05) | 6개월 목표 (2026-11) |
| --- | --- | --- |
| MAU | 23,047 | 46,000+ |
| DAU/MAU | 4.2% | 7~10% |
| 검색 CTR | 2.29% | 4.5~5.5% |
| 네이버 유입 비율 | 36% | 45~50% |
| 챔피언스 페이지 30일 UV | 3,494 | 20,000~40,000 |

## 참고 사항

- 본 작업은 코드 변경 없는 분석/기획 산출물 — 이후 동일 버전(`feature/1.39.0`) 내 후속 작업 브랜치에서 코드 변경 진행
- 후속 작업 우선순위는 `traffic-growth-implementation-plan.md`의 단계 A → B → C 순서를 따름
- 효과 측정은 4~8주 후 GA4·네이버 SC 데이터 기준으로 진행 예정
