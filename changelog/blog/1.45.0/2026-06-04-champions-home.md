---
slug: 1-45-0-champions-home
title: '[1.45.0] 챔피언스 홈 페이지 Phase 1 — 포맷 분리 + 신규 섹션 + 백엔드 Breaking 대응'
description: '/champions 를 포맷별(/champions/[format]) 라우트로 전환, S/A 티어 노출 + 빠른 진입 카드 + 인기 포켓몬 조합(사이즈 선택) 신규 섹션 도입, 백엔드 사용률 출처 Pikalytics 통합본 전환 Breaking 대응.'
authors: [jsg3121, claude]
tags: [feature, champions, breaking-change]
---

# 1.45.0 — 챔피언스 홈 페이지 Phase 1

> **작업 일자**: 2026-06-03 ~ 2026-06-04
> **작업 브랜치**: `feature/1.45.0-champions-home`
> **연결 SPEC**: `.claude/specs/champions-frontend-implementation-plan.md` (Phase 1)

## 📋 작업 개요

**작업 유형**: 라우트 구조 변경 + 신규 UI 섹션 도입 + 백엔드 API Breaking 대응
**담당**: jsg3121 + Claude

`champions-frontend-implementation-plan.md` Phase 1 (홈) 단계. 백엔드의 신규 스키마
(Smogon + Pikalytics 하이브리드)를 기반으로 챔피언스 홈을 포맷별 라우트로 전환하고,
사용자 피드백("정보가 빈약함")을 반영해 신규 섹션을 다수 도입했다.

ux-designer 에이전트로 정보 위계/레이아웃 설계 → 자사 다크 톤 무드 정합 →
사용자 검증/피드백 반영 사이클로 진행했다.

<!-- truncate -->

## 🎯 라우트 구조 변경

| 변경 | 처리 |
| --- | --- |
| 신규 라우트 | `/champions/[format]/page.tsx` (format = `vgc` | `bss`) |
| 기존 라우트 삭제 | `/champions/page.tsx` 제거 |
| 영구 리다이렉트 | `next.config.js` redirects: `/champions` → `/champions/vgc` (301) |
| sitemap | `/champions/vgc`, `/champions/bss` 추가, `/champions` 제거 |

## 🧩 신규 섹션 및 컴포넌트

### 페이지 레이아웃

```
[1] PageHeader (포맷별 타이틀)
[2] 포맷 토글 (VGC / BSS)
[3] 포맷 안내 캡션
[4] Hero — 가장 인기있는 포켓몬 TOP 3 (가로 스크롤)
[5] A 티어 가로 스크롤
[6] 빠른 진입 카드 3개 (도감/티어/대회)
[7] 인기 포켓몬 조합 (페어/트리오/스쿼드 선택)
[8] 챔피언스 광고 슬롯
[9] Footer
```

### 신규 컴포넌트

| 컴포넌트 | 역할 |
| --- | --- |
| `ChampionsFormatTab` (Phase 0 작성, Phase 1 인입) | VGC/BSS 포맷 토글 |
| `ChampionsHomeSectionHeader` | 섹션 제목 + 우측 더보기 링크 (재사용) |
| `ChampionsHeroSection` | S 티어 TOP 3 가로 스크롤 |
| `ChampionsQuickLinks` | 빠른 진입 카드 3개 (도감/티어/대회) |
| `ChampionsTeamCoreSection` (client) | 사이즈 선택 셀렉트박스 + 코어 리스트 |
| `ChampionsTeamCoreCard` | 자사 정보 카드 무드의 조합 카드 |

### 자사 다크 톤 무드 적용

자사 페이지 전체 배경이 `primary-1` (짙은 네이비) 인 점을 명시적으로 식별하고
모든 신규 카드를 다음 표준 패턴으로 통일했다.

- 배경: `bg-primary-4` (밝은 회색)
- 테두리: `border-[2px] border-primary-1`
- 시그니처 이중 그림자: `shadow-[0_0_0px_3px_var(--color-primary-4)]`
- 호버: `hover:scale-105 transition-transform` (MoveDetailCard 패턴)

기존 `MoveDetailCard`, `AbilityCard` 와 동일 무드.

## 🔄 인기 포켓몬 조합 — 사이즈 선택 기능

- 셀렉트박스로 페어(2마리) / 트리오(3마리) / 스쿼드(4마리) 전환
- 백엔드 호출은 1회 (`size` 미지정 + `limit: 30`)
- 클라이언트에서 사이즈별 그룹화 + TOP 5 슬라이스
- 데이터 없는 사이즈는 disabled + "(없음)" 표시
- 사이즈에 따라 카드 내 포켓몬 이미지 크기 자동 조정 (64/56/48px)

## 💬 VGC/BSS 포맷 안내 캡션

신규 유틸 `getFormatIntro` 추가. 첫 방문자가 VGC/BSS 약어를 인지할 수 있도록
포맷 토글 바로 아래에 풍부한 소개 문구 노출.

- VGC: "Video Game Championships. 포켓몬 공식 세계 대회에서 사용하는 더블
  배틀 포맷입니다. 6마리 중 4마리를 선택하여 2:2 동시 배틀로 진행합니다."
- BSS: "Battle Stadium Singles. 닌텐도 스위치 본가 게임의 공식 랭크전 싱글
  포맷입니다. 6마리 중 3마리를 선택하여 1:1 배틀로 진행합니다."

기존 `getFormatDescription` 은 SEO 메타 description 용 짧은 한 줄로 유지 (역할 분리).

## ⚠️ 백엔드 Breaking 대응

백엔드가 사용률 출처를 Smogon Stats(래더 기반) → Pikalytics 통합본
(Top 50 토너먼트 기반 + 51위 이하 Smogon 폴백)으로 전환하면서 다음 항목 제거됨.

### GraphQL 정리

- `GetChampionsPokemonDetail` 쿼리에서 `$rating: ChampionsRating` 파라미터 + 호출 인자 제거
- `ChampionsUsageByRating` Fragment 정의 + 사용처 2곳 제거
- codegen 재실행으로 자동 갱신

### 라운딩 로직 제거

- 백엔드가 소숫점 2자리로 라운딩 후 응답 → 프론트의 `toFixed(1)` 호출 8곳 제거
- 사용률 / 승률 / 카운터 KO율 / 채용 사용률 등 모두 백엔드 응답값 그대로 노출

### `winRate` 가드 강화

- truthy 체크 → `!= null` 체크 (`winRate: 0` 값도 표시되도록 안전성 강화)

### UI 표현 정리

- PageHeader 설명에서 "상위 1760 레이팅 기준" 표현 제거 (`rating` 인자가 사라졌으므로 부정확)

## 🛠 기타 개선

### 자사 표준 정보 카드 무드 통일

- 빠른 진입 카드(`ChampionsQuickLinks`) 자사 표준 카드 무드로 재설계
- 팀 코어 카드(`ChampionsTeamCoreCard`) 자사 표준 카드 무드로 재설계
- 아이콘 박스 자사 뱃지 패턴(`bg-primary-2 + text-white + rounded-md`)으로 통일

### S/A 티어 일관성

- 데스크탑 S 티어 3열 그리드 → A 티어와 동일한 가로 스크롤 + 200px 카드로 통일
- 모바일 S/A 티어 모두 175px 카드 너비 통일

### 섹션 순서 조정

- BSS 포맷에서 팀 코어 데이터가 비어있는 케이스를 고려해
  Hero(S) → A 티어 → 빠른 진입 → 팀 코어 순서로 재배치
- S/A 가 위쪽에 묶여 정보 위계 명확화

### 모바일 팀 코어 카드 레이아웃 분기

- 데스크탑: 가로 한 줄 (h-32)
- 모바일: 세로 스택 — 순위 뱃지 absolute + 이미지·이름 동일 들여쓰기 정렬
- 사용자 피드백("이미지와 이름 정렬 어긋남") 반영

## 🤖 사용한 에이전트 / 스킬

| 에이전트 | 사용 시점 | 산출물 |
| --- | --- | --- |
| `ux-designer` | 정보 위계/레이아웃 설계 (백지 상태에서) | 와이어프레임 + 섹션 IA + 컴포넌트 분리안 |
| `ui-publisher` (시안 모드) | 1차 시안 작성 (자사 무드 미반영으로 폐기) | (폐기) |

> ui-publisher 사용 결과 자사 다크 톤이 반영되지 않아 시안 단계 생략하고
> 자사 컬러 사용 패턴(코드에서 직접 추출)으로 본 구현 진입.
> 이 사건을 계기로 `ui-publisher.md` 에 "자사 무드 재현 의무" 지침 추가됨.

## 🔧 검증

- `npm run lint`: 챔피언스 관련 신규 경고 없음
- `tsc --noEmit`: 통과
- `npm run build`: 성공
- dev server에서 VGC/BSS 진입 + 셀렉트박스 전환 + 모바일 카드 정렬 모두 확인

## 🔜 후속 작업 (Phase 2~5)

| Phase | 작업 브랜치 | 내용 |
| --- | --- | --- |
| Phase 2 | `feature/1.45.0-champions-list` | 챔피언스 리스트 (`usageRank` 노출) |
| Phase 3 | `feature/1.45.0-champions-tier` | 챔피언스 티어 (폼별 분리 노출) |
| Phase 4 | `feature/1.45.0-champions-detail` | 챔피언스 상세 (EV/카운터/사용률 신규 섹션, 폼 라우트 5개) + 출처 캡션 본격 노출 |
| Phase 5 | `feature/1.45.0-champions-tournaments` | 대회 신규 페이지 |

특히 Phase 4 에서는 백엔드 명세의 권장대로
"사용률·승률 출처: Pikalytics (토너먼트 기반)" / "세부 통계 출처: Smogon (래더 기반)"
캡션을 본격 노출 예정.
