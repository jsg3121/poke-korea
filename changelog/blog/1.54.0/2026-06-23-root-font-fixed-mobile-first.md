---
slug: 1-54-0-root-font-fixed-mobile-first
title: '[1.54.0] root font-size 16px 고정 + DS 컴포넌트 모바일 퍼스트'
description: '화면별로 root font-size를 16/14/12px로 바꾸던 반응형 폰트 스케일링을 폐기하고 16px로 고정(ADR-0009). 1rem=16px 단일 기준 위에서 PokemonCard·Tag·HorizontalScrollList를 모바일 퍼스트 2단계 토큰으로 재정비. 긴 이름 폰트 단계 축소, 헤더 고정 높이, 흰 테두리 gap 보정 등 실사용 케이스 대응.'
authors: [jsg3121, claude]
tags: [design-system, responsive, component]
---

# 1.54.0 — root font-size 16px 고정 + DS 컴포넌트 모바일 퍼스트

> **작업 일자**: 2026-06-23
> **작업 브랜치**: `feature/1.54.0-root-font-fixed`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 근간 정비 (root 폰트 + 모바일 퍼스트)
**담당**: jsg3121 + Claude

DS 컴포넌트를 토큰으로 규격화하는 과정에서, 화면 폭에 따라 root `font-size`를
바꾸던 기존 구조가 **토큰의 실제 px을 예측 불가능하게 만든다**는 문제가 드러났다.
이를 16px 고정으로 바꾸고(ADR-0009), 그 위에서 이미 만든 DS 컴포넌트를 모바일
퍼스트 토큰으로 재정비했다.

<!-- truncate -->

## 🔧 root font-size 16px 고정 (ADR-0009)

`globals.css`는 화면 폭에 따라 root `font-size`를 16/14/12px로 바꾸고 있었다.
이러면 모든 `rem`이 함께 스케일돼, `px-5`(1.25rem)가 모바일 15px·데스크톱 20px로
달라지고, `w-56`(14rem) 카드가 모바일 168px·데스크톱 224px가 됐다. **DS의 "단일
고정 규격"과 정면 충돌**한다.

| 변경 | 내용 |
| --- | --- |
| 화면별 `font-size`(16/14/12px) 미디어쿼리 | **제거** → root 16px 고정 |
| `min-width`(960/845px) 제약 | **제거** (적응형 잔재, 반응형 전환과 충돌) |
| 모바일 크기 차등 | rem 자동 축소 → **모바일 퍼스트 토큰**으로 명시 |

`styling.md`에 "root 16px 고정, 모바일 축소는 토큰으로 표현" 규칙을 명문화했다.

## 📱 DS 컴포넌트 모바일 퍼스트 재정비

16px 고정으로 `1rem=16px`이 모든 화면에서 동일해지면서, 모바일에서 "작아지는"
동작은 **모바일 퍼스트 2단계 토큰**(base=모바일, `desktop:`=확장)으로 명시한다.

### PokemonCard

- 폭·이미지·폰트·포켓볼·패딩을 2단계 토큰화(모바일 ~0.71배, 데스크톱 비율 유지).
  모바일 2열 그리드에 들어가도록 `w-40 desktop:w-56`
- **긴 이름**(챔피언스 "켄타로스 (팔데아 블레이즈종)" 등): `whitespace-nowrap`으로
  한 줄 유지 + 길이별 폰트 단계 축소(`getNameFontClass`)로 잘림 방지. 긴 이름은
  `No.xxx` 아랫줄로 통째 내려감
- 이름이 1줄이든 2줄이든 **헤더 고정 높이**라 카드 전체 높이가 일정(그리드 정렬)
- 스탯 라벨 `whitespace-nowrap`으로 "특수공격" 줄바꿈 깨짐 방지

### Tag

- 모바일 퍼스트 2단계(`w-12/h-5/text-2xs` → `desktop:w-14/h-6/text-xs`)
- 정렬을 flex → `block + text-center + line-height`로 변경. Gmarket Sans는 글자가
  line-box 위로 치우치는 폰트라, line-height를 **height+2px**(`calc`)로 주는 게
  광학적으로 정확히 중앙에 온다(height 토큰과 같은 수치에 묶어 종속)

### HorizontalScrollList

- 간격·패딩 모바일 퍼스트(`gap-4 desktop:gap-6`, `p-2 desktop:p-4`)
- PokemonCard 흰 테두리가 `box-shadow`(spread)라 레이아웃 밖에 그려져 gap을
  ~8px 잠식 → 그만큼 gap을 더 줘 시각적 간격 확보

## ⚠️ 후속

- 기존 레거시 페이지(모바일 컨테이너들)는 16px 고정으로 실제 px이 커지지만, 페이지별
  전면 재설계 대상이라 지금 손대지 않는다(미배포 전제).
- 보류된 QuizCard DS 초안은 이 변경 머지 후 16px 기준으로 재검증한다.
- 모바일 gutter 표준(좌우 여백 px) 확정은 후속 작업.

## 🔗 관련

- ADR-0009 root font-size 16px 고정 (`.claude/decisions/records/ADR-0009-root-font-size-fixed.md`)
- [ADR-0007 반응형 렌더링 전략](/blog/1-54-0-responsive-pivot)
- [DS Tag + PokemonCard](/blog/1-54-0-ds-pokemon-card)
- [DS HorizontalScrollList](/blog/1-54-0-ds-horizontal-scroll-list)
