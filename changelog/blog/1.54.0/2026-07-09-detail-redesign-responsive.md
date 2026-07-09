---
slug: 1-54-0-detail-redesign-responsive
title: '[1.54.0] 상세 페이지 개편 — 반응형 단일 + StatBar·종 내비'
description: '/detail 본문 라우트 5개를 UA 분기 데/모 2벌에서 반응형 단일로 재구축. 레이더 차트를 DOM 기반 StatBar 가로 막대(카운트업 모션)로 교체하고, 종 단위 이전/다음 내비를 신설. 폼 전환은 데/모 동일한 상시 라벨 칩으로 통일, 기술 표는 MoveTable 컴팩트 행으로 전환.'
authors: [jsg3121, claude]
tags: [feature, ux, css, a11y]
---

# 1.54.0 — 상세 페이지 개편: 반응형 단일 + DS 조립

> **작업 일자**: 2026-07-09
> **작업 브랜치**: `feature/1.54.0-detail-redesign`
> **설계 근거**: [RES-003 레퍼런스 조사](/.claude/research/reports/RES-003-detail-page-reference.md) · [UX-005 재설계](/.claude/research/reports/UX-005-detail-redesign.md)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 3호)
**담당**: jsg3121 + Claude

홈(PR #179)·리스트(PR #180)에 이어 /detail 본문을 개편. 조사(RES-003) →
ux-designer 설계(UX-005) → DS 시안 → 사용자 결정(개정 1·2) → 구현의 사이클.
신규 DS 2종(StatBar·MoveTable)을 story 선행 구축 후 조립했다.
`moves` 하위 라우트 6개는 트랙 B(후속)로 분리.

## 🎯 해결한 문제

- **[Critical] 폼 전환 hover 슬라이드가 스탯 카드를 침범해 라벨 잘림**(C1) —
  절대위치 음수 left 슬라이드 트랙이 레이더 카드와 겹치던 구조. hover 의존이라
  터치 기기에선 라벨 발견 자체가 불가
- **[Critical] 레이더 차트 접근성 차단**(C3) — canvas 전용 렌더라 스탯 수치를
  스크린리더가 읽을 수 없음(WCAG 1.1.1)
- **데/모 폼 전환 UI 불일치**(M1) — 데스크톱 아이콘 전용 vs 모바일 라벨 칩
- **이전/다음 포켓몬 내비 부재**(M2) — 벤치마크 4/5가 보유한 종 단위 순차 탐색 없음
- **UA 분기 데/모 2벌**(M5) — 컨테이너 약 26개 파일 완전 중복(ADR-0007 위반)

<!-- truncate -->

## ✨ 주요 변경사항

### 1. StatBar — 레이더 차트를 DOM 가로 막대로 교체 (신규 DS)

- 수치가 실제 DOM 텍스트라 접근성 차단이 근본 해소. 막대는 장식(aria-hidden),
  모션 중에도 스크린리더는 sr-only 최종값만 읽는다
- 막대 최댓값은 **최고 능력치 + 20**(동적 — 기존 레이더의 maxPoint+10과 같은 방식,
  여유폭만 확대). 최고/최저는 색 차등 + "최고"/"최저" 텍스트 마커 병기(색 단독
  의존 금지), **동률이면 전부 마킹**
- **뷰포트 진입 시 카운트업 모션**(IntersectionObserver + rAF, 1회) — SSR HTML엔
  처음부터 최종값이 렌더되고(SEO·no-JS 안전), prefers-reduced-motion은 자동 생략

### 2. 종 단위 이전/다음 내비 신설

- `◀ No.005 파이리 | No.007 어니부기 ▶` — 콘텐츠 최상단, 번호+이름 병기(벤치마크 표준)
- **철저히 종 단위**: 어떤 폼 페이지에서도 항상 인접 번호의 기본 폼으로 이동(폼 미승계
  — 폼이 내비를 오염하는 반면교사 회피). 경계(1번·마지막)는 방향 비활성
- `<a href>`(LinkButton) 구현 — 1000+ 상세 페이지를 잇는 크롤 경로(Google 권장)
- 데이터는 경량 쿼리(GetDetailMovesPokemonInfo) 재사용, 도감 범위 밖은 null 처리

### 3. 히어로 재구성 + 폼 전환 통일

- **이름·도감번호·타입을 첫 화면으로 승격**(기존엔 기본정보 카드까지 스크롤 필요) —
  벤치마크 5/5의 "식별 정보 먼저" 공식
- 폼 전환은 히어로 **외부의 독립 로우**에서 데/모 동일한 **상시 라벨 칩**(Chip 규격
  Link 조립)으로 — C1·M1 동시 해소. 노말폼 다중 종은 ◀/▶ + "n/N" 슬라이드로 순회
- 스탯 카드는 히어로와 분리된 별도 flow — 겹침 결함의 재발 여지 제거

### 4. MoveTable — 기술 표 컴팩트 행 전환 (신규 DS)

- **단일 마크업**이 모바일에선 2줄 컴팩트 행(행당 ~64px, 기존 카드 220px 대비 축소),
  데스크톱에선 `display: contents`로 정렬된 표가 된다 — 마크업 2벌 display:none
  토글 없이(ADR-0007) 해결
- 가로 스크롤 표는 페이지 세로 스크롤과 축이 중첩되어 기각(사용자 결정). 같은 이유로
  기존의 "고정 높이 + 내부 overflow 스크롤"도 폐기 — 상위 10개 + "전체 기술 보기" 링크
- 값마다 인라인 라벨(위력/명중/PP — 데스크톱 sr-only)이라 폭과 무관하게 SR 동등

### 5. 그 외 DS 조립·개선

| 요소 | 내용 |
|---|---|
| 기본정보 행 | 고정 h-12 → **min-h-12** — 애드센스 자동 광고가 본문에 주입돼도 겹침 없이 세로 확장(기존 배지 겹침의 원인은 광고 주입으로 판명) |
| 퀴즈 배너 | 밝은 카드 + LinkButton CTA로 강화(유입 확대), 특성·상성 직후 맥락 배치 유지 |
| 진화 체인 | 맨 이미지 나열 → 카드 어포던스(hover scale·focus ring) + HorizontalScrollList 재사용 |
| 타입 상성 | 기존 강점/약점 토글 구조 유지(우수 판정) + role=tab 시맨틱 보강 |
| 크롬 | UA 분기는 전역 헤더/푸터/탭바 선택만 잔존. 광고 배너는 잠정 제외(반응형 유닛 트랙) |

## 🔍 검증

- `tsc --noEmit` · `eslint` · `next build` · `build-storybook` 전부 통과
- StatBar·MoveTable은 Storybook 실렌더 캡처(1024/375)로 동률 마킹·열 정렬 확인
- 구버전(Detail.desktop/mobile, container/desktop·mobile/detail)은 미삭제 —
  사용처 0건 상태로 유지, 구버전 일괄 제거 트랙에서 정리 예정

## 📎 남은 작업 (트랙 B·후속)

- `moves` 하위 라우트 6개 반응형 단일화 + 광고 슬롯 조건부 collapse(M3)
- 버전 그룹 라우트 canonical 검토(SEO — seo-specialist 협의)
- JSON-LD BreadcrumbList·ImageObject 보강(RES-003 권고 6)
