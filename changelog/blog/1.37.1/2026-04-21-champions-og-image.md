---
slug: champions-og-image
title: '챔피언스 상세 페이지 OG 이미지 동적 적용'
description: '챔피언스 포켓몬 상세 페이지에서 포켓몬별 동적 OG 이미지를 적용하여 SNS 공유 시 해당 포켓몬 이미지가 표시되도록 개선'
authors: [jsg3121, claude]
tags: [seo, feature-improvement]
---

# 챔피언스 OG 이미지 동적 적용

> **작업 날짜**: 2026-04-21
> **브랜치**: `feature/1.37.1-fix-champions-og`

## 작업 개요

**작업 유형**: 기능 개선
**담당**: Claude Code

## 작업 목표

챔피언스 포켓몬 상세 페이지의 OG 이미지를 기존 고정 이미지에서 포켓몬별 동적 이미지로 변경하여, SNS 공유 시 해당 포켓몬의 이미지가 표시되도록 개선합니다.

<!-- truncate -->

## 주요 변경사항

### 변경 1: OG 이미지 URL 동적 생성 함수 추가

**변경 전**:
```typescript
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`
```

**변경 후**:
```typescript
const OG_IMAGE_BASE = 'https://image.poke-korea.com/og-images'

function getOgImageUrls(
  pokemonNumber: number,
  formType: string,
  formIndex: number,
) {
  const normalizedFormType = formType.toLowerCase()

  const folder =
    normalizedFormType === 'base'
      ? formIndex > 0
        ? 'form'
        : 'default'
      : normalizedFormType

  const fileId =
    folder === 'default' || folder === 'gigantamax'
      ? `${pokemonNumber}`
      : `${pokemonNumber}-${formIndex}`

  return {
    large: `${OG_IMAGE_BASE}/${folder}/${fileId}-large.png`,
    medium: `${OG_IMAGE_BASE}/${folder}/${fileId}-medium.png`,
  }
}
```

### 변경 2: 쿼리 변경 및 OG 이미지 적용

- `GetChampionsPokemonList` 쿼리에서 `GetChampionsPokemonDetail` 쿼리로 변경
- `pokemon.pokemonNumber`, `formType`, `formIndex` 필드를 활용하여 OG 이미지 경로 생성
- `formType` 대소문자 정규화 처리 (챔피언스 데이터는 `BASE`, `REGION` 등 대문자 사용)

## 기술적 세부사항

### OG 이미지 경로 규칙

| 폼 타입 | formIndex | 폴더 | 파일명 형식 |
|---------|-----------|------|-------------|
| BASE | 0 | default | `{pokemonNumber}-large.png` |
| BASE | > 0 | form | `{pokemonNumber}-{formIndex}-large.png` |
| REGION | any | region | `{pokemonNumber}-{formIndex}-large.png` |
| GIGANTAMAX | any | gigantamax | `{pokemonNumber}-large.png` |

### 적용 예시

| 포켓몬 | OG 이미지 경로 |
|--------|----------------|
| 리자몽 (기본) | `og-images/default/6-large.png` |
| 히스이 윈디 | `og-images/region/59-0-large.png` |
| 켄타로스 워터종 | `og-images/region/128-2-large.png` |

## 수정된 파일

- `src/app/champions/list/[pokemonId]/_metadata/generateChampionsDetailMetadata.ts`

## 참고 사항

- 포켓몬 상세 페이지(`/detail/[pokemonId]`)와 동일한 OG 이미지 CDN 경로 사용
- large(1200x630), medium(800x800) 두 사이즈 이미지 모두 메타데이터에 포함
