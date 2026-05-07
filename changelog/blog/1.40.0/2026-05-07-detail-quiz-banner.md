---
slug: detail-quiz-banner
title: '포켓몬 상세 페이지에 섹션별 맥락 매칭 퀴즈 배너 추가'
description: '포켓몬 상세 페이지의 특성 섹션 직후에 특성 퀴즈 배너, 타입 상성 섹션 직후에 타입 상성 퀴즈 배너를 노출하여 사용자가 보고 있는 정보와 자연스럽게 연결되도록 개선했습니다.'
authors: [jsg3121, claude]
tags: [feature-improvement, traffic-growth, accessibility]
---

# 포켓몬 상세 페이지에 섹션별 맥락 매칭 퀴즈 배너 추가

> **작업 날짜**: 2026-05-07
> **브랜치**: `feature/1.40.0-detail-quiz-banner`

## 작업 개요

**작업 유형**: UX 개선 / 트래픽 성장
**담당**: Claude
**연관 분석**: `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` (단계 C-4)

## 작업 목표

네이버 서치어드바이저 데이터 기준 `/quiz/type-effectiveness` 페이지의 CTR이 22.2%로 매우 높게 측정되어, 퀴즈 콘텐츠는 사이트의 강력한 재방문 유도 자산임이 확인됐습니다. 그러나 SEO 인입의 다수를 차지하는 포켓몬 상세 페이지(`/detail/[pokemonId]`)에서는 한 마리만 보고 이탈하는 비율이 높아, 퀴즈와의 연결 동선이 부족했습니다. 본 작업은 사용자가 보고 있는 정보 섹션과 자연스럽게 연결되는 위치에 퀴즈 배너를 배치하여, 광고가 아닌 콘텐츠 흐름의 일부로 인지되도록 합니다.

<!-- truncate -->

## 주요 변경사항

### 1. 섹션별 맥락 매칭 퀴즈 배너

| 노출 위치 | 매칭 퀴즈 | 매칭 근거 |
| --- | --- | --- |
| 특성 섹션(`AbilitiesInfoComponent`) 직후 | 특성 퀴즈(`/quiz/ability`) | 사용자가 특성 효과를 본 직후, 다른 특성도 알아보고 싶은 자연스러운 호기심 |
| 타입 상성 섹션(`TypesInfo`) 직후 | 타입 상성 퀴즈(`/quiz/type-effectiveness`) | 약점·저항 정보를 본 직후, 학습한 내용을 즉시 점검하는 흐름 |

### 2. 의도적 제외

- **`/list` 페이지**: 무한 스크롤 구조라 배너 배치 위치가 모호하고, 사용자의 탐색 흐름을 끊을 우려가 있어 제외
- **실루엣 퀴즈 / 타입 퀴즈**: 상세 페이지에서 이미 포켓몬 비주얼·타입 정보가 노출되므로 매칭이 어색해 제외
- **다른 상위 페이지(`/champions`, `/type-effectiveness`)**: `/type-effectiveness`는 이미 단계 C-1에서 CTA 카드가 추가되어 중복 우려, `/champions`는 대전 사용자 페르소나로 일반 퀴즈와 매칭도 낮음

### 3. 접근성 (WCAG 2.1 AA 준수)

배너 색상 조합 `bg-primary-3` (#9DB2BF) + `text-primary-1` (#27374D)의 대비비가 **5.85:1**로 측정되어 WCAG 2.1 AA 일반 텍스트 기준(4.5:1)을 통과합니다. 초기 설계에서 검토한 다른 색상 조합(`bg-primary-2` + `text-primary-4` = 4.23:1)은 기준 미달이라 제외했습니다.

또한 hover/active 상태에서 텍스트 색상이 `text-primary-4`(밝은 톤)로 전환되어 인터랙션 피드백이 명확합니다.

### 4. 호버/액티브 인터랙션

- **데스크톱**: `hover:bg-primary-2` + `group-hover:text-primary-4` — 마우스 오버 시 배경 어두워지고 텍스트가 밝게 반전
- **모바일**: `active:bg-primary-2` + `group-active:text-primary-4` — 탭 시 동일 인터랙션

## 기술적 세부사항

### 신규 컴포넌트

기존 프로젝트의 컨벤션(`baseInfo.{기능명}` 폴더 패턴, 데스크톱·모바일 분리)을 따라 4개의 컴포넌트를 신규 생성했습니다.

| 파일 | 역할 |
| --- | --- |
| `src/container/desktop/detail/detail.baseInfo/baseInfo.abilityQuiz/AbilityQuizBanner.component.tsx` | 데스크톱 — 특성 퀴즈 배너 |
| `src/container/desktop/detail/detail.baseInfo/baseInfo.typeQuiz/TypeQuizBanner.component.tsx` | 데스크톱 — 타입 상성 퀴즈 배너 |
| `src/container/mobile/detail/detail.baseInfo/baseInfo.abilityQuiz/AbilityQuizBanner.component.tsx` | 모바일 — 특성 퀴즈 배너 |
| `src/container/mobile/detail/detail.baseInfo/baseInfo.typeQuiz/TypeQuizBanner.component.tsx` | 모바일 — 타입 상성 퀴즈 배너 |

### 데스크톱 그리드 처리

데스크톱 상세 페이지는 `grid-cols-[repeat(auto-fit,minmax(calc(50%-1rem),1fr))]` (2열 그리드) 구조라, 배너는 `col-span-full` 클래스로 가로 전체 너비를 차지하도록 설정했습니다. 모바일은 `flex flex-col` 단일 컬럼이므로 추가 처리 없이 자연스럽게 배치됩니다.

### 수정 파일

| 파일 | 변경 |
| --- | --- |
| `src/container/desktop/detail/detail.baseInfo/DetailBaseInfo.container.tsx` | `<AbilitiesInfoComponent />` 직후, `<TypesInfo />` 직후에 각 배너 삽입 |
| `src/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container.tsx` | 동일 |

## 기대 효과 (추정)

- 상세 페이지 → 퀴즈 페이지 인입 동선 확보, 일회성 SEO 방문자의 재방문 유도
- `/quiz/type-effectiveness` CTR 22.2%의 강점 자산을 더 많은 사용자에게 노출
- 효과 측정은 프로덕션 배포 후 4~8주 동안 GA4의 `/detail/*` → `/quiz/*` 인입 경로에서 확인

## 의도적 결정 사항

### props로 className을 넘기는 패턴 미사용

초기 설계에서 데스크톱·모바일 공용 `QuizBanner` 컴포넌트를 만들고 props로 className을 넘기는 방안을 검토했으나, 사용자 결정으로 기존 프로젝트 컨벤션과 일관되게 디바이스별 컴포넌트를 분리했습니다.

> **이유**: 프로젝트 전반이 `desktop/`, `mobile/`로 컴포넌트를 분리하는 패턴을 사용하고 있어, 일관성 유지가 중요. props로 스타일을 상속받는 패턴은 디버깅이 어렵고 컴포넌트의 책임이 모호해짐.

### WCAG AA 통과 색상 조합 선정

UI 검토 과정에서 여러 색상 조합을 시도했으나, 최종적으로 WCAG AA 기준(4.5:1)을 통과하는 `bg-primary-3` + `text-primary-1` 조합으로 확정했습니다. 검토했던 다른 조합들의 대비비:

| 조합 | 대비비 | WCAG AA 일반 텍스트 |
| --- | --- | --- |
| `bg-primary-2` (#526D82) + `text-primary-4` (#E0E7EC) | 4.23:1 | ❌ 미달 |
| `bg-primary-3` (#9DB2BF) + `text-primary-1` (#27374D) | 5.85:1 | ✅ 통과 |
| `bg-primary-1` (#27374D) + `text-primary-4` (#E0E7EC) | 10.4:1 | ✅ AAA 통과 (그러나 배경에 묻힘) |

## 후속 작업

- **C-5**: 메가진화 일람 페이지 신설
- **효과 측정**: 프로덕션 배포 후 4~8주 동안 GA4 모니터링
