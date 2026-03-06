---
slug: shiny-notice-and-seo-fix
title: '이로치 안내 문구 추가 및 기술 상세 버전별 SEO 개선'
description: '이로치 모드에서 이미지 미적용 안내 문구를 추가하고, 기술 상세 버전별 페이지의 JSON-LD 및 메타데이터에 버전 정보를 반영하여 SEO를 개선했습니다.'
authors: [jsg3121, claude]
tags: [ux, seo]
---

# 이로치 안내 문구 추가 및 기술 상세 버전별 SEO 개선

> **작업 날짜**: 2026-03-06
> **브랜치**: `feature/1.34.0`

## 📋 작업 개요

**작업 유형**: UX 개선 / SEO 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

1. 이로치 모드에서 일부 포켓몬의 이로치 이미지가 아직 적용되지 않았음을 사용자에게 안내하여 혼동을 방지
2. 기술 상세 버전별 페이지의 JSON-LD 및 OG/Twitter 메타데이터에 버전 정보가 누락된 SEO 회귀 문제 수정

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 이로치 모드 안내 문구 추가

이로치 모드(`?shinyMode=shiny`) 활성화 시 이미지 미적용 안내 문구를 데스크톱/모바일에 표시합니다.

**데스크톱** — 포켓몬 이미지 섹션 하단에 배치:

```tsx
{isShiny && (
  <p className="text-xs text-primary-3 absolute bottom-0 left-0">
    ※ 일부 포켓몬은 이로치 이미지가 아직 적용되지 않았으며,
    확인되는 대로 업데이트될 예정입니다.
  </p>
)}
```

**모바일** — 포켓몬 이름 아래, 이로치 툴팁 버튼 위에 배치:

```tsx
{isShiny && (
  <>
    <p className="w-full px-4 text-xs text-primary-3 mb-2">
      ※ 일부 포켓몬은 이로치 이미지가 아직 적용되지 않았으며,
      확인되는 대로 업데이트될 예정입니다.
    </p>
    <div className="flex-items-gap-2 ml-4">
      <ShinyTooltipComponent />
      <ShinyRateComponent />
    </div>
  </>
)}
```

### 변경 2: 기술 상세 버전별 SEO 전면 개선

`getMoveDetailVersionJsonLd` 함수에 `versionGroupName` 파라미터를 추가하고, JSON-LD의 `name`, `description`, `breadcrumb`에 버전 정보를 반영했습니다.

또한 `generateMoveDetailVersionMetadata`(OG/Twitter Card)에도 `versionGroupName`을 전달하도록 수정하여 메타데이터 title/description에 버전명이 포함되도록 개선했습니다. `fetchMoveDetailMetadata`에서 `versionGroupId`가 있을 때만 `getVersionGroups` API를 병렬 호출하여 버전명을 조회합니다.

**변경 전**:

```typescript
getMoveDetailVersionJsonLd(skillId, skillName, versionGroupId)
// name: "포켓몬 몸통박치기 기술 정보 - 포케 코리아"
// description: "몸통박치기 기술의 버전별 정보와..."
// breadcrumb: 홈 → 기술도감 → 기술명 (3뎁스)
```

**변경 후**:

```typescript
getMoveDetailVersionJsonLd(skillId, skillName, versionGroupId, versionGroupName)
// name: "포켓몬 몸통박치기 (스칼렛/바이올렛) 기술 정보 - 포케 코리아"
// description: "몸통박치기 스칼렛/바이올렛 버전의 기술 정보와..."
// breadcrumb: 홈 → 기술도감 → 기술명 → 버전명 (4뎁스)
```

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 |
| ---- | ------- | ------- |
| JSON-LD name 버전 정보 | 미포함 | 포함 |
| JSON-LD description 버전 정보 | 미포함 | 포함 |
| Breadcrumb 뎁스 | 3뎁스 | 4뎁스 |
| OG/Twitter 메타데이터 버전명 | 미포함 | 포함 |
| 이로치 미적용 안내 | 없음 | 데스크톱/모바일 표시 |

## 🔧 기술적 세부사항

### 수정된 파일

| 파일 | 변경 내용 |
| ---- | --------- |
| `src/constants/movesJsonLd.ts` | `getMoveDetailVersionJsonLd`에 `versionGroupName` 파라미터 추가, name/description/breadcrumb 반영 |
| `src/app/moves/[id]/version/[versionGroupId]/page.tsx` | `generateMetadata`와 JSON-LD 모두에 `versionGroupName` 전달 |
| `src/app/moves/[id]/_fetch/moveDetailMetadata.fetch.ts` | `versionGroupId` 존재 시 `getVersionGroups` API 병렬 호출 추가 |
| `src/container/desktop/detail/detail.summary/DetailSummary.container.tsx` | 이로치 모드 안내 문구 추가 |
| `src/container/mobile/detail/detail.summary/DetailSummary.container.tsx` | 이로치 모드 안내 문구 추가 |
| `changelog/blog/1.34.0/2026-03-05-version-group-migration.md` | 섹션 3의 기술 리스트 API 호출 관련 불일치 내용 수정 |

## 📌 참고 사항

- `fetchMoveDetailMetadata`에서 `getVersionGroups` API는 `versionGroupId`가 있을 때만 호출되므로, 기본 상세 페이지(`/moves/[id]`)에는 불필요한 API 호출이 발생하지 않음
- 이로치 안내 문구는 이로치 모드 활성화 시에만 노출되므로 일반 사용에는 영향 없음
