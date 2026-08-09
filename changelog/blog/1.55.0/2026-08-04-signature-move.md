---
slug: signature-move
title: '포켓몬 상세 — 전용기 섹션 추가 및 전용 기술 설명 표시'
description: '포켓몬 상세 페이지에 전용기(signature move) 섹션을 새로 추가하고, 전용기·전용 Z기술·거다이맥스 세 전용 기술 섹션에 기술 설명과 개념 안내를 통일된 형태로 표시했습니다.'
authors: [jsg3121, claude]
tags: [feature, ux, graphql]
---

# 포켓몬 상세 — 전용기 섹션 추가 및 전용 기술 설명 표시

> **작업 날짜**: 2026-08-04
> **브랜치**: `feature/1.55.0-signature-move`

## 📋 작업 개요

**작업 유형**: 신규 기능 / UX 개선 / GraphQL 연동
**담당**: jsg3121, claude

## 🎯 작업 목표

포켓몬 상세 페이지는 전체 검색 노출의 약 49%를 차지하지만 CTR은 사이트 평균의 1/3 수준으로, 노출 대비 전환이 낮은 저평가 자산이다. 상세 페이지에 고유 정보를 더해 콘텐츠 두께를 키우고, 상성표 단일 페이지 의존을 완화하는 것이 상위 전략이다.

그 첫 단계로, 데이터(`signatureMoves` 플래그)가 이미 존재하나 UI에서 소비되지 않던 **전용기(signature move)를 별도 섹션으로 노출**한다. 아울러 전용기·전용 Z기술·거다이맥스 세 "전용 기술" 섹션의 표시 형태가 제각각이던 것을 통일하고, 각 기술의 설명을 함께 보여준다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 전용기 섹션 신규 추가

전용기는 별도 데이터가 아니라 레벨업·머신 습득 기술 중 `signatureMoves === true`인 기술이다. 이를 필터·중복 제거해 별도 카드 섹션으로 표시한다. 전용기가 없는 포켓몬은 섹션을 렌더하지 않는다(전용 Z기술 카드와 동일 패턴).

- 신규 컨테이너: `DetailSignatureMoves.container.tsx`
- 배치: 상세 뷰의 전용 Z기술 ↔ 습득 기술 사이
- 표는 기존 `MoveTableComponent`를 재활용

### 변경 2: 세 전용 기술 섹션의 설명·안내 통일

전용기·전용 Z기술·거다이맥스 세 섹션이 모두 **표 → 기술 설명 → 개념 안내** 순서의 동일한 구조를 갖도록 정리했다.

- 공통 컴포넌트 신설: `components/MoveDescription.component.tsx`
  - `MoveEffectDescription`: 기술 효과 설명(좌측 강조 바 + 배경)
  - `MoveConceptNote`: "○○ 정보" 개념 안내(제목 + 본문 박스)
- 개념 안내 문구를 여러 레퍼런스(Bulbapedia, 나무위키·팬덤위키) 정의를 종합해 독자 작성하고, 서비스 톤에 맞춰 해요체로 통일

### 변경 3: 전용 Z기술 설명 표시 (백엔드 스키마 연동)

전용 Z기술 설명은 상세 페이지 쿼리(`PokemonZMoveSkillInfo`)에 필드가 없어 표시할 수 없었다. 백엔드가 `description` 필드를 추가(삭제되지 않은 최신 세대 기준)함에 따라, 쿼리에 `zSkill.description`을 추가해 표시한다.

### 변경 4: 설명 표시 디테일 개선

- **줄바꿈 정리**: 원본 설명의 게임 내 표시용 줄바꿈(`\n`)이 웹에서 불필요한 줄바꿈을 만들어, 공백으로 치환해 한 문단으로 흐르게 함
- **가시성 향상**: 설명 박스 배경·좌측 강조 바·본문 색을 조정해 표를 압도하지 않으면서도 잘 읽히도록 조정

## 🔧 기술적 세부사항

### 수정/추가 파일

| 파일 | 내용 |
| --- | --- |
| `src/container/detail/DetailSignatureMoves.container.tsx` | 신규 — 전용기 섹션 |
| `src/container/detail/components/MoveDescription.component.tsx` | 신규 — 설명·안내 공통 컴포넌트 |
| `src/container/detail/DetailExclusiveMoves.container.tsx` | 전용 Z기술·거다이맥스 설명/안내 통일 |
| `src/views/detail/Detail.view.tsx` | 전용기 섹션 배치 |
| `src/gql/query.graphql` | `exclusiveZMoves.zSkill.description` 추가 |

### 데이터 연동

- 전용기 설명: `learnableSkills` 스킬의 `description`(이미 제공되던 필드)
- 전용 Z기술 설명: 백엔드 `PokemonZMoveSkillInfo.description` 추가 → `codegen` → 쿼리 반영
- 거다이맥스 설명: 기존 `gmaxMove.effect` 유지

## 📌 참고 사항

- **전용기 표시 조건**: 프론트는 "포켓몬이 습득하는 기술 목록"에서 `signatureMoves = true`인 것을 표시한다. 따라서 플래그가 true여도 `pokemon_learnable_skills`에 습득 관계가 없으면 표시되지 않는다(일부 전용기의 습득 관계 데이터 보정은 백엔드에서 진행 예정).
- **후속 작업**: 상세 페이지 정보 확장 전략의 다음 단계는 진화 조건 표시(③-b)이며, 백엔드 스키마 계약 합의 후 진행한다. 상세 계획은 `.claude/specs/detail-page-expansion-spec.md` 참조.
