---
slug: 1-54-0-champions-source-change
title: '[1.54.0] 챔피언스 데이터 원천 변경 대응 — 사용률·승률 → 채택 top1, 포맷 URL 개편'
description: '챔피언스 메타 데이터 원천이 시뮬레이터(Smogon/Pikalytics)에서 실게임 랭크전 데이터(championsbattledata)로 바뀌며 usageRate·winRate가 항상 null이 됐다. 카드·상세의 사용률/승률 표시를 실제 채택 top1(인기 기술·특성·도구, 한글명)로 교체하고 인기도는 채택 순위(usageRank)로 표현하도록 개편했다. 함께 포맷 URL 슬러그를 vgc/bss에서 double/single로 바꾸고 301 리다이렉트를 추가했다.'
authors: [jsg3121, claude]
tags: [feature, ux, data, nextjs, seo]
---

# 1.54.0 — 챔피언스 데이터 원천 변경 대응

> **작업 일자**: 2026-07-28
> **작업 브랜치**: `feature/1.54.0-champions-source-change`
> **설계 근거**: ux-designer 캡처 기반 분석 (top1 정보구조 재설계 · 포맷 명칭 단순화)

## 📋 작업 개요

**작업 유형**: 데이터 원천 변경 대응 (백엔드 소스 전환에 따른 프론트 정합화)
**담당**: jsg3121 + Claude

챔피언스 사용률/메타 데이터의 원천이 **팬 시뮬레이터(Pokémon Showdown 기반
Smogon/Pikalytics)에서 실제 게임 랭크전 데이터(championsbattledata)로 전환**됐다.
새 소스는 실게임에서 집계된 메타를 매일 반영하지만, **사용률 퍼센트(usageRate)와
승률(winRate)은 제공하지 않는다.** 대신 채택 순위(usageRank)와 실제 채택 top1
필드(topMove·topAbility·topItem, 한글명)를 제공한다.

스키마는 하위호환을 유지해(필드 제거 없음, 값만 null) 쿼리는 깨지지 않았으나,
사용률·승률을 표시하던 UI가 전부 `-` 또는 `0%`로 깨져 보이게 되어 이를 실제 채택
정보로 교체했다.

## 🎯 해결한 문제

- **[Critical] 티어 리스트 카드가 "사용률 0%" 거짓 정보 노출** — `usageRate ?? 0`을
  막대 그래프 width에 직접 대입해, 데이터 부재가 "0% 채택"으로 오독되는 상태였다.
  막대를 제거하고 실제 채택 top1(인기 기술·도구)로 교체
- **[Critical] 티어 페이지 출처 표기 오류** — "출처: Smogon"으로 표기됐으나 실제
  원천은 championsbattledata.com. 상세 페이지 표기와도 불일치했다. 정정
- **[Major] 도감·홈 카드 본문 절반이 의미 없는 대시** — 종족값/사용률/승률 3행 중
  사용률·승률이 전부 `-`. 실제 채택 top1로 교체
- **[Major] 상세 요약바가 비대칭으로 깨짐** — 4칸(티어/사용률/승률/순위) 중 사용률
  칸은 미노출, 승률은 `-`만 남아 빈 자리가 컸다. 티어·채택 순위 2칸으로 재구성
- **[Major] 클라이언트 정렬 무력화** — 홈 TOP3·티어 그룹 내 정렬이 `usageRate`
  기준이라 전부 0이 되어 정렬이 사라졌다. `usageRank` 오름차순으로 교체
- **[Minor] 데이터와 불일치하는 문구** — "가장 높은 사용률", "사용률 기반 티어
  분류" 등을 "가장 많이 채택되는", "채택 순위 기반"으로 정정

## 🔧 주요 변경

### 1. 데이터 계층 — 프래그먼트에 채택 필드 추가

`ChampionsPokemonCard`(도감)·`ChampionsMetaSummary`(홈/티어) 프래그먼트에
`usageRank`·`tier`·`topMove`·`topAbility`·`topItem`을 추가하고 codegen을 재실행했다.
GraphQL enum(`VGC_DOUBLES`/`BSS_SINGLES`)은 그대로다.

### 2. 카드 UI — 사용률·승률 → 채택 top1

- **도감 카드**(`ChampionsPokemonCard`): 종족값·순위 요약줄 + 인기 기술/특성/도구
  3종. 라벨:값을 한 줄에 배치해 본문 세로 높이를 줄여 이미지 영역을 확보했다.
  값은 말줄임 없이 `break-keep`(한글 단어 단위 줄바꿈)으로 전부 노출
- **홈/챔피언스 홈 카드 통합**: 메인 홈이 쓰던 `ChampionsCard`를 챔피언스 홈의
  `ChampionsTopCard`로 통합·제거(중복 컴포넌트 정리). 본문은 순위 + 인기 기술
- **티어 리스트 아이템**(`ChampionsTierPokemonItem`): 0% 고정 막대 2개 제거 →
  인기 기술·인기 도구 top1

### 3. 상세 요약바 재구성

`ChampionsDetailMetaSummaryBar`의 사용률·승률 칸을 제거하고 **티어 · 채택 순위**
2칸으로 재구성했다. 인기 기술/도구/특성 top 정보는 바로 아래 본문 순위 막대
(`ChampionsMetaList`)에 이미 있어 중복 배치하지 않았다. 상세 본문 순위 막대는
usageRate가 정상 제공되어 그대로 유지한다.

### 4. 정렬 로직 — usageRank 기반

`compareByUsageRank` 유틸을 신설(usageRank 오름차순, null은 뒤로)해 홈 TOP3·티어
그룹 내 정렬을 교체했다. 서버 정렬(`ChampionsPokemonSort.USAGE`)은 백엔드가
usageRank 기준으로 처리하므로 변경하지 않았다.

폼 리다이렉트(메타 없는 폼 진입 → 인기 폼 자동 이동) 로직은 제거했다. 새 데이터에선
메타 없는 폼의 `formSiblings`도 usageRate가 전부 null이라 `filter(usageRate != null)`가
항상 빈 배열이 되어 리다이렉트가 발동할 수 없는 죽은 코드가 됐기 때문이다(실데이터
검증).

### 5. 포맷 URL 슬러그 — vgc/bss → double/single

대회 포맷명(VGC/BSS) 대신 게임 배틀 구분(더블/싱글)을 노출하기로 해, URL 슬러그와
UI 표기를 사용자 친화적으로 전면 교체했다.

- `championsFormat.util`: 슬러그 타입·파싱·enum매핑·라벨 5종 전부 double/single로.
  라벨 "더블 배틀"/"싱글 배틀", 포맷 소개 문구를 게임 규칙 중심으로 재작성
- sitemap URL·폼 경로 빌더, tournaments JSON-LD, `[format]/page.tsx` 분기 로직,
  story·주석 일괄 갱신
- `next.config.js`: `/champions/vgc(/:path*)` → `/champions/double`,
  `bss` → `single` **301(308) 영구 리다이렉트** 추가. 기존 색인 URL 링크 자산 보존

## ✅ 검증

- 타입 체크(`tsc --noEmit`)·ESLint 통과
- 실제 렌더 캡처(desktop/mobile): 홈·티어·도감·상세 카드 top1 표시, 정렬 순위대로,
  요약바 재구성, 문구/출처 정정 확인
- 구 URL(`/champions/vgc`, `/champions/vgc/tier`) → 신 URL 308 리다이렉트 실동작 확인
- 상세 본문 순위 막대의 인기 도구/특성 %는 정상 제공됨을 서버 응답으로 확인(캡처의
  0.0%는 카운트업 애니메이션 미관측 상태였고 데이터 버그가 아님)

## 📝 참고

- 스키마 하위호환 유지 — 필드 제거 없이 값만 null. 기존 쿼리는 깨지지 않음
- `ChampionsFormSibling`에는 서버에도 usageRank가 없어 폼 리다이렉트를 순위 기준으로
  전환할 수 없었고, 위 검증대로 기능 자체가 실효되어 제거로 귀결
- 팀코어(`ChampionsTeamCore`)의 usageRate는 스키마·데이터에 유지되어 인기 조합
  섹션은 그대로 동작
