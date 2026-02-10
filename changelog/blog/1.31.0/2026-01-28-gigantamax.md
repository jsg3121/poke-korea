---
slug: gigantamax
title: 거다이맥스 기능 추가
description: '포켓몬 상세 페이지에 거다이맥스(Gigantamax) 스위치, 전용 기술 정보 표시, 리스트 필터링 기능을 추가한 과정'
authors: [jsg3121, claude]
tags: [feature]
---

# 거다이맥스 기능 추가 (gigantamax)

## 📋 작업 개요

**브랜치**: `feature/1.31.0-gigantamax`
**작업 유형**: 기능 추가
**작업 기간**: 2026-01-28
**담당**: Claude Code

<!-- truncate -->

## 🎯 작업 목표

포켓몬 상세 페이지에 거다이맥스(Gigantamax) 정보 표시 기능 추가. 기존 메가진화, 리전폼과 동일한 패턴으로 거다이맥스 스위치와 전용 기술 정보를 표시하고, 리스트 페이지에서 거다이맥스 포켓몬 필터링 기능 추가.

### 주요 기능

1. **상세 페이지**: 거다이맥스 가능 포켓몬에 스위치 버튼 표시
2. **전용 기술 정보**: 거다이맥스 모드에서 레벨업/기술머신 대신 전용 기술(gmaxMove) 표시
3. **리스트 필터**: 거다이맥스 가능 포켓몬 필터링 옵션 추가

## ✨ 주요 변경사항

### 1. GraphQL 쿼리 추가

**src/gql/query.graphql**:

```graphql
query GetPokemonGigantamax($pokemonId: Int!) {
  getPokemonGigantamaxByPokemonId(pokemonId: $pokemonId) {
    id
    pokemonId
    name
    formName
    imagePath
    gigantamaxCode
    gmaxMove {
      id
      identifier
      pokemonId
      nameKo
      type
      power
      effect
    }
  }
}
```

**src/gql/fragment.graphql** - `PokemonCard` fragment에 `isGigantamax` 필드 추가

### 2. 타입 확장

**src/types/detailContext.type.ts**:

```typescript
export type TActiveType = 'normal' | 'mega' | 'region' | 'gigantamax'

export type TActiveTypeInfo = {
  // ... 기존 필드
  isGigantamax: boolean
}
```

### 3. 라우트 페이지 생성

**URL 패턴**:

```
/detail/{pokemonId}/gigantamax          # 거다이맥스 페이지
/detail/{pokemonId}/gigantamax/{index}  # 거다이맥스 폼 인덱스
```

**파일 구조**:

```
src/app/detail/[pokemonId]/(form)/gigantamax/
└── [[...index]]/
    └── page.tsx
```

### 4. 컴포넌트 추가

| 컴포넌트                         | 위치                                              | 설명                       |
| -------------------------------- | ------------------------------------------------- | -------------------------- |
| `GigantamaxSwitch.component.tsx` | desktop/detail/detail.summary/components/         | 데스크톱 거다이맥스 스위치 |
| `GigantamaxSwitch.component.tsx` | mobile/detail/detail.summary/components/          | 모바일 거다이맥스 스위치   |
| `GmaxMoveInfo.component.tsx`     | desktop/detail/detail.baseInfo/baseInfo.gmaxMove/ | 데스크톱 전용 기술 정보    |
| `GmaxMoveInfo.component.tsx`     | mobile/detail/detail.baseInfo/baseInfo.gmaxMove/  | 모바일 전용 기술 정보      |

### 5. DetailBaseInfo 조건부 렌더링

거다이맥스 모드일 때 레벨업/기술머신 습득 기술 대신 거다이맥스 전용 기술 표시:

```tsx
{
  isGigantamaxMode ? (
    <GmaxMoveInfoComponent />
  ) : (
    <>
      <LevelLearnableSkillComponent />
      <MachineLearnableSkillComponent />
    </>
  )
}
```

### 6. 이미지 모듈 거다이맥스 지원 추가

**src/module/image.module.ts**:

- `getImageList`: gigantamax 케이스 추가, `imagePath` 필드로 이미지 코드 생성
- `getFormUrl`: gigantamax URL 패턴 생성 로직 추가
- `getAltText`: 거다이맥스 폼 텍스트 처리 추가

```typescript
case 'gigantamax': {
  const gigantamaxImages = gigantamaxInfo?.map((gmax) => {
    return {
      imageCode: gmax.imagePath,
      types: types,
      name: gmax.name,
    }
  })
  return gigantamaxImages
}
```

**PokemonImage.compoment.tsx** (desktop/mobile):

- `DetailContext`에서 `gigantamaxInfo` 가져오기
- `getImageList` 호출 시 `gigantamaxInfo` 전달

### 7. 리스트 페이지 필터 추가

**FilterModal.component.tsx**:

- `isGigantamax` 필터 옵션 추가
- "거다이맥스 가능 포켓몬 포함" 라디오 그룹 UI

**page.tsx (list)**:

- `isGigantamax` 쿼리 파라미터 처리
- GraphQL 필터에 `isGigantamax` 전달
- 메타데이터에 거다이맥스 필터 정보 반영

## 📊 변경 파일 목록

| 파일                                                                                            | 변경 내용                             |
| ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| `src/gql/query.graphql`                                                                         | GetPokemonGigantamax 쿼리 추가        |
| `src/gql/fragment.graphql`                                                                      | PokemonCard에 isGigantamax 추가       |
| `src/types/detailContext.type.ts`                                                               | TActiveType에 gigantamax 추가         |
| `src/context/Detail.context.tsx`                                                                | gigantamaxData, isGigantamax 추가     |
| `src/app/detail/[pokemonId]/(form)/modules/fetchDetailData.ts`                                  | fetchGigantamaxData 함수 추가         |
| `src/app/detail/[pokemonId]/(form)/modules/generateMetadata.ts`                                 | gigantamaxData 파라미터 추가          |
| `src/app/detail/[pokemonId]/(form)/gigantamax/[[...index]]/page.tsx`                            | 신규 - 거다이맥스 라우트 페이지       |
| `src/module/generateDetailSeoMetaData.ts`                                                       | gigantamax URL/이름 처리 추가         |
| `src/constants/pokemonJsonLd.ts`                                                                | gigantamaxName 파라미터 추가          |
| `src/container/desktop/detail/detail.summary/DetailSummary.container.tsx`                       | GigantamaxSwitch 렌더링 추가          |
| `src/container/desktop/detail/detail.summary/components/GigantamaxSwitch.component.tsx`         | 신규 - 데스크톱 스위치 컴포넌트       |
| `src/container/desktop/detail/detail.baseInfo/DetailBaseInfo.container.tsx`                     | GmaxMoveInfo 조건부 렌더링            |
| `src/container/desktop/detail/detail.baseInfo/baseInfo.gmaxMove/GmaxMoveInfo.component.tsx`     | 신규 - 데스크톱 전용 기술 컴포넌트    |
| `src/container/mobile/detail/detail.summary/DetailSummary.container.tsx`                        | GigantamaxSwitch 렌더링 추가          |
| `src/container/mobile/detail/detail.summary/components/GigantamaxSwitch.component.tsx`          | 신규 - 모바일 스위치 컴포넌트         |
| `src/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container.tsx`                      | GmaxMoveInfo 조건부 렌더링            |
| `src/container/mobile/detail/detail.baseInfo/baseInfo.gmaxMove/GmaxMoveInfo.component.tsx`      | 신규 - 모바일 전용 기술 컴포넌트      |
| `src/views/mobile/list/header/filter/filter.pokemonType/filter.modal/types/filterForm.type.ts`  | isGigantamax 타입 추가                |
| `src/views/mobile/list/header/filter/filter.pokemonType/filter.modal/FilterModal.component.tsx` | 거다이맥스 필터 UI 추가               |
| `src/app/list/page.tsx`                                                                         | isGigantamax 필터 로직 및 메타데이터  |
| `src/module/image.module.ts`                                                                    | gigantamax 이미지 리스트/URL/alt 지원 |
| `src/container/desktop/detail/detail.summary/summary.pokemonImage/PokemonImage.compoment.tsx`   | gigantamaxInfo 전달 추가              |
| `src/container/mobile/detail/detail.summary/summary.pokemonImage/PokemonImage.compoment.tsx`    | gigantamaxInfo 전달 추가              |

### 8. SEO / JSON-LD 거다이맥스 지원 보완 (2026-01-29)

거다이맥스 페이지에서 JSON-LD 구조화 데이터가 올바르게 생성되지 않던 문제 수정.

**수정 내용**:

- `src/constants/pokemonJsonLd.ts`: `gigantamaxData` 파라미터 추가, `getImageList`에 gigantamax 케이스 추가, `displayName`에 거다이맥스 이름 전달, `getAbilities`에 gigantamax 케이스 추가
- `src/module/generateDetailSeoMetaData.ts`: `getPokemonTypes`에 gigantamax 케이스 추가, `getPokemonStats`에 gigantamax 케이스 추가
- `src/app/detail/[pokemonId]/(form)/gigantamax/[[...index]]/page.tsx`: `generatePokemonJsonLd` 호출 시 `gigantamaxData` 전달

**기존 문제점**:

1. `generatePokemonJsonLd`에서 `gigantamaxName`이 항상 빈 문자열로 전달됨
2. `getPokemonTypes`, `getPokemonStats`에서 gigantamax 케이스 미처리 (default로 빠짐)
3. `getImageList`, `getAbilities`에서 gigantamax 케이스 미처리

**수정 후**:

```typescript
// pokemonJsonLd.ts - gigantamaxData 파라미터 추가
interface PokemonJsonLdProps {
  // ...
  gigantamaxData?: PokemonGigantamax[]
}

// getImageList에 gigantamax 케이스 추가
case 'gigantamax': {
  const gigantamaxImages = gigantamaxData?.map((gmax) => ({
    imageCode: gmax.imagePath,
  }))
  return gigantamaxImages
}

// displayName에 올바른 거다이맥스 이름 전달
gigantamaxName: gigantamaxData?.[activeIndex]?.name || '',

// getAbilities에 gigantamax 케이스 추가
case 'gigantamax':
  return pokemonDetail.pokemonAbilityList
```

### 9. 사이트맵에 거다이맥스 페이지 추가 (2026-01-29)

사이트맵에 거다이맥스 관련 페이지가 누락되어 있던 문제 수정.

**수정 내용**:

- `src/gql/query.graphql`: `GetPokemonGigantamaxList` 쿼리 추가
- `src/app/sitemap.ts`: 거다이맥스 상세 페이지 및 리스트 필터 페이지 추가

**추가된 사이트맵 URL**:

1. 거다이맥스 상세 페이지: `/detail/{pokemonId}/gigantamax`
2. 거다이맥스 필터 리스트 페이지: `/list?isGigantamax=true`

## 📝 향후 작업

- 없음

## 📌 참고 사항

- 거다이맥스는 소드/실드(8세대)에서 등장한 시스템으로, 특정 포켓몬만 가능
- 거다이맥스 포켓몬은 고유한 전용 기술(G-Max Move)을 사용
- 기존 메가진화, 리전폼과 동일한 URL 패턴 및 UI 패턴 적용
- `shinyMode` 쿼리 파라미터는 기존과 동일하게 유지
