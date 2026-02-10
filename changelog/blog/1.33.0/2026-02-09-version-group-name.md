---
slug: version-group-name
title: '버전 그룹명 baseVersionGroupName 적용'
authors: [jsg3121, claude]
tags: [feature-improvement, graphql]
---

# 버전 그룹명 baseVersionGroupName 적용 (version-group-name)

## 📋 작업 개요

**브랜치**: `feature/1.33.0-version-group-name`
**작업 유형**: 기능 개선
**작업 기간**: 2026-02-09
**담당**: Claude Code

<!-- truncate -->

## 🎯 작업 목표

백엔드에서 `getVersionGroups` 쿼리에 `baseVersionGroupId`와 `baseVersionGroupName` 필드가 추가됨. 기존에 UI에서 `nameKo`로 표시하던 버전 시리즈명을 실제 노출용 `baseVersionGroupName`으로 교체.

## ✨ 주요 변경사항

### 변경 1: GraphQL 쿼리/프래그먼트 필드 추가

`VersionGroup` 프래그먼트와 `GetVersionGroups` 쿼리에 신규 필드 추가.

**변경 전:**

```graphql
fragment VersionGroup on VersionGroup {
  versionGroupId
  name
  nameKo
  generationId
}
```

**변경 후:**

```graphql
fragment VersionGroup on VersionGroup {
  versionGroupId
  name
  nameKo
  generationId
  baseVersionGroupId
  baseVersionGroupName
}
```

### 변경 2: UI 컴포넌트 버전명 표시 교체

사용자에게 버전 시리즈명이 노출되는 모든 위치에서 `nameKo` → `baseVersionGroupName` 교체.

**변경 위치:**

- 기술 헤더 (최초/최신 등장 버전 라벨, 버전 선택 버튼)
- 상세 페이지 습득 기술 카드 (레벨업/머신 버전 정보)

### 변경 3: 메타데이터 버전명 교체

SEO 메타데이터(title, description)에서 버전 시리즈명 표시를 `baseVersionGroupName`으로 교체.

## 📊 변경 결과

| 위치                         | 변경 전  | 변경 후                |
| ---------------------------- | -------- | ---------------------- |
| 기술 헤더 버전 라벨          | `nameKo` | `baseVersionGroupName` |
| 기술 헤더 버전 버튼          | `nameKo` | `baseVersionGroupName` |
| 습득 기술 버전 정보          | `nameKo` | `baseVersionGroupName` |
| 메타데이터 title/description | `nameKo` | `baseVersionGroupName` |

## 🔧 기술적 세부사항

### 수정 파일

| #   | 파일                                                  | 변경 내용                                              |
| --- | ----------------------------------------------------- | ------------------------------------------------------ |
| 1   | `src/gql/fragment.graphql`                            | `baseVersionGroupId`, `baseVersionGroupName` 필드 추가 |
| 2   | `src/gql/query.graphql`                               | `GetVersionGroups` 쿼리에 동일 필드 추가               |
| 3   | `src/container/desktop/.../MovesHeader.container.tsx` | `nameKo` → `baseVersionGroupName` (3곳)                |
| 4   | `src/container/mobile/.../MovesHeader.container.tsx`  | `nameKo` → `baseVersionGroupName` (3곳)                |

## 📌 참고 사항

- 백엔드 API에서 `baseVersionGroupName` 필드가 사전 배포되어 있어야 프론트 배포 가능
- `nameKo` 필드는 제거하지 않고 유지 (기존 참조가 있을 수 있음)
