---
slug: flavor-text
title: '포켓몬 상세 페이지에 버전별 도감 설명 섹션 추가'
description: '상세 페이지에 게임 버전별 도감 설명을 세대 탭(모바일은 드롭다운)으로 보여주는 섹션을 추가했습니다. 폼 페이지는 그 폼의 설명을, 없으면 기본 모습 설명을 보여줍니다.'
authors: [jsg3121, claude]
tags: [feature, ux, graphql]
---

# 포켓몬 상세 페이지에 버전별 도감 설명 섹션 추가

> **작업 날짜**: 2026-11-23
> **브랜치**: `feature/1.63.0-flavor-text`

## 📋 작업 개요

**작업 유형**: 기능 추가
**담당**: jsg3121, claude

## 🎯 작업 목표

포켓몬 상세 페이지에서 1세대 레드·그린부터 LEGENDS Z-A까지 게임 버전별 도감 설명을 볼 수 있게 한다. 메가진화·리전폼·거다이맥스·노말폼 페이지에서는 그 폼의 설명을 보여준다.

<!-- truncate -->

## 📉 왜 필요했나

- 상세 페이지에는 수치와 표(능력치, 특성, 제원)만 있고, "이 포켓몬이 어떤 존재인지" 소개하는 서술형 정보가 없었다.
- 도감 설명은 종마다 다른 한국어 고유 텍스트라 상세 페이지의 콘텐츠를 보강한다. 형제 페이지(폼 페이지)끼리 같은 문장이 반복되지 않도록 폼마다 해당 설명을 보여줄 필요가 있었다.
- 백엔드 DB에는 도감 설명 데이터가 있었지만 GraphQL로 노출되지 않았다. 백엔드에서 `PokemonDetail.flavorTexts`와 폼 연결 정보(`forms`)를 추가해 프론트에서 쓸 수 있게 됐다.

## ✨ 주요 변경사항

### 변경 1: 상세 쿼리에 `flavorTexts` 추가 — `src/gql/query.graphql`

```graphql
flavorTexts {
  versionName
  flavorText
  forms {
    formType
    formIndex
  }
  versionGroup {
    ...VersionGroup
    displayName
    isLatest
  }
}
```

- `fetchPokemonDetail`이 쿼리 결과를 스키마 타입 `PokemonDetail`로 반환하므로, `versionGroup`은 필수 필드를 갖춘 기존 `VersionGroup` 프래그먼트를 재사용했다.
- 백엔드 스키마에 `PokemonFormType.GIGANTAMAX`가 추가됐다. 프론트에서 폼 타입을 전부 분기하는 곳이 없어 영향은 없다.

### 변경 2: 데이터 가공 — `src/containers/detail/modules/flavorText.module.ts`

`getFlavorTextSection({ flavorTexts, activeType, activeIndex })`가 화면용 구조를 만든다.

| 단계 | 처리 |
| --- | --- |
| 폼 거르기 | 기본 페이지(`normal`/0)는 `BASE`/0과 `NORMAL_FORM`/0 행을, 폼 페이지는 `activeType`에 대응하는 폼 타입과 `activeIndex`가 같은 행을 남긴다 |
| 대체 | 활성 폼 전용 설명이 없으면 기본 모습 설명으로 대체하고 `isFallback`을 켠다 |
| 묶기 | 서버 순서(최신 버전 그룹 순)를 유지하며 세대 → 버전 그룹 → 문장으로 묶는다 |
| 병합 | 같은 버전 그룹 안에서 문장이 같은 버전은 한 항목으로 합친다 |

- 기본 페이지가 `NORMAL_FORM`/0도 보는 이유: 러브로스 화신폼처럼 노말폼 0번이 기본 모습인 종은 `BASE` 행이 없다.
- `forms`가 빈 행(폼 페이지가 없는 모습, 기본 설명과 중복인 행)은 거르기 단계에서 자연스럽게 빠진다.

### 변경 3: 도감 설명 카드 — `DetailFlavorText.container.tsx`, `DetailFlavorTextPanel.component.tsx`

- 위치: `DetailStatsBanner`(광고)와 `DetailInfoSection`(기본 정보) 사이. 광고 슬롯 위치와 개수는 바뀌지 않았다.
- 세대 선택
  - 데스크톱: 세대 탭. WAI-ARIA APG Tabs 패턴(roving tabindex, ←/→·Home·End 이동)을 따른다.
  - 모바일: DS `SelectInput`(`tone="onLight"`, `fullWidth`). 변경 4 참고.
  - 두 컨트롤은 모두 DOM에 있고 CSS(`desktop:`)로 하나만 보인다. `useDevice`로 분기 렌더하지 않는다.
  - 진입할 때마다 최신 세대가 선택된다. 세대가 하나뿐이면 컨트롤 없이 내용만 보인다.
- 패널: 모든 세대를 SSR로 렌더하고 비선택 세대는 `hidden` 속성으로 숨긴다. 숨긴 세대의 문장도 HTML에 포함된다.
- 행 구조: 왼쪽은 버전 그룹 표시명(`displayName`)과 "최신" 칩, 오른쪽은 버전별 문장이다. 문장이 같은 버전은 이름을 세로로 쌓고 문장은 하나만, 버전이 하나인 그룹은 문장만 보인다.
- 대체 설명일 때 "기본 모습 기준 설명이에요" 부제를 붙인다.
- 행은 `min-h` 기반이다. 기존 `infoRowClass`는 고정 높이라 여러 줄 문장이 잘려 쓰지 않았다.
- 데스크톱 2열은 임의값 grid 대신 flex + `w-56`, 줄 간격은 `leading-relaxed` 토큰을 쓴다(`styling.md` 임의값 금지).

### 변경 4: DS `SelectInput` 확장 — `src/components/input/SelectInput.component.tsx`

1.54.0에 만든 DS 셀렉트였지만 실제 사용처가 없었고(챔피언스 셀렉트 3곳은 각자 직접 구현), 어두운 배경 전용·14px라 밝은 카드 안에서 쓸 수 없었다. 이번 섹션을 첫 사용처로 삼아 확장했다.

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 글자 크기 | 14px(`text-sm`) | 16px(`text-md`) — iOS Safari 포커스 확대 방지 |
| 배경 톤 | 진한 배경 전용 | `tone`: `onDark`(기본) / `onLight` |
| 폭 | 내용 폭 | `fullWidth` prop |
| 화살표 | 브라우저 기본(오른쪽 끝에 붙음) | `appearance-none` + SVG. 오른쪽 16px 여백(`right-4`, `pr-11`), 선 굵기 2.5 |
| 값 변경 | `e.target.value as T` | options에서 찾은 값만 전달(단언 제거) |

| 비활성 옵션 | 없음 | 옵션별 `disabled` |

- Storybook에 `OnLight`, `OnLightFullWidth` story를 추가했다.

### 변경 5: 챔피언스 셀렉트 3곳을 `SelectInput`으로 통일

직접 구현한 `<select>` 3곳이 테두리·글자·여백이 제각각이었고 화살표가 오른쪽 끝에 붙어 있었다. 모두 `SelectInput`(`tone="onDark"`, 라벨 시각적 숨김)으로 바꿔 소스에 직접 구현한 `<select>`가 남지 않게 했다.

| 위치 | 화면 | 비고 |
| --- | --- | --- |
| `ChampionsTeamCoreSection` | 챔피언스 홈 "인기 포켓몬 조합" 크기 선택 | 모바일 `fullWidth`, 데스크톱 내용 폭. 데이터 없는 크기는 `disabled` 옵션 + "(없음)" |
| `ChampionsPokedexSortSelect` | 챔피언스 도감 정렬(sticky 바) | `text-xs`·1px 테두리 → DS 규격 |
| `ChampionsMonthFilterSelect` | 대회 목록 월별 필터 | Suspense 스켈레톤 높이를 셀렉트와 맞춤(`h-touch desktop:h-9`) |

- 값 변환에서 `Number(e.target.value) as CoreSize`, `e.target.value as SortQueryValue` 단언을 없앴다. 옵션 목록에서 찾은 값만 상태로 넘긴다.
- 화면 변화: 테두리 `primary-1` → `primary-2`, 글자 굵게 → 보통(16px), 모바일 높이 44px. 도감 정렬이 있는 sticky 바는 모바일에서 높이가 늘어난다.

## 🔍 검증

- `tsc --noEmit`, ESLint, Prettier 통과
- 가공 함수를 로컬 GraphQL 서버 실데이터로 실행해 확인

| 경우 | 결과 |
| --- | --- |
| 리자몽 기본 | 9개 세대. 4세대는 하트골드/소울실버 분리, 디아루가/펄기아 병합 |
| 메가리자몽X | 7세대만, 레츠고 피카츄!/레츠고 이브이! 병합 |
| 호연캡 피카츄(`form/9`) | 9·8·7세대, 7세대는 썬·문 공유 문장 |
| 러브로스 기본 / 영물폼 | 각각 화신폼 / 영물폼 설명만 |

- 개발 서버 SSR HTML 확인

| 페이지 | 결과 |
| --- | --- |
| `/detail/6` | tabpanel 9개, 그중 8개 `hidden` |
| `/detail/25/form/1` (옷갈아입기 피카츄) | 전용 설명 없음 → 대체 + 부제 |
| `/detail/6/mega`, `/detail/905` | 세대 1개 → 컨트롤 없음 |
| `/champions/double`, `/champions/double/list`, `/champions/tournaments` | 셀렉트가 `SelectInput` 마크업으로 렌더 |

- QA(`qa-orchestrator`): lint·code-review·a11y·seo·e2e 실행, 차단 0건. E2E 9개 흐름 × mobile/desktop 통과 15건, 회귀 0건(탭 클릭·키보드 이동, 모바일 select 전환, 기본 설명 대체, 폼 전환 포함). 권장 항목(text-base 병기, 임의값, 대체 판단 순서, 모바일 tabpanel 탭 정지점, DS 미사용)은 반영했다.
- **확인하지 않은 것**: 스크린리더 실제 낭독, 프로덕션 RSC payload 크기(gzip 후)

## ⚠️ 구현 시 고려한 점

- **펼치기 목록 대신 세대 탭**: 최신 3개 + "더 보기"로 펼치는 안을 먼저 시안으로 만들었으나, 전부 펼치면(피카츄 30개 이상) 오히려 읽기 어려워 세대 단위 전환으로 바꿨다.
- **모바일은 탭 대신 드롭다운**: 세대가 최대 9개라 모바일에서 탭이 가로 스크롤되면 뒤쪽 세대가 가려진다. 네이티브 select는 OS 선택 UI와 키보드·스크린리더 지원을 그대로 쓴다.
- **CSS 라디오 트릭은 쓰지 않음**: JS 없이 탭을 만들 수 있지만 스크린리더에 탭으로 인식되지 않는다.
- **서로 다른 버전 그룹끼리 병합하지 않음**: 연속된 그룹의 같은 문장(블랙2·화이트2와 블랙·화이트 등)을 합치면 라벨이 "·"로 길게 이어져, 그룹마다 각자 행으로 둔다.
- **폼 이름(`formName`) 대신 `forms`로 연결**: 위키 표기 자유 텍스트라 폼 데이터와 이름이 맞지 않는다(리전폼 일치 0건). 백엔드가 행마다 폼 타입·순번을 붙여 주도록 했다.
- **세대 탭은 DS `TabItem`을 쓰지 않음**: `TabItem`은 진한 배경 전용이고 roving tabindex용 `tabIndex`·키보드 핸들러를 받지 않는다. 이번 섹션에서만 쓰여 컨테이너 안에 두고, 다른 곳에서 필요해지면 라이트 variant로 DS에 올린다.
- **셀렉트는 새 컴포넌트 대신 기존 `SelectInput` 확장**: 같은 역할의 DS 컴포넌트가 이미 있었다. 실제 화면은 이를 쓰지 않고 각자 구현해 규격이 갈라져 있어, 확장 후 모든 사용처를 옮겨 한 규격으로 맞췄다.

## 📌 참고 사항

- **배포 순서**: 이 쿼리는 상용 백엔드에 `flavorTexts`·`forms`가 있어야 동작한다. 없으면 GraphQL 검증 오류로 상세 페이지 전체가 실패한다. 백엔드 상용 반영은 완료됐다.
- **ISR 캐시**: 상세 페이지는 `revalidate` 1년이다. 이번 배포로 캐시가 새로 만들어지며, 백엔드에서 함께 고친 리전폼 순번(나옹·켄타로스) 문제도 리전폼 기술 페이지(`/detail/52/moves/region` 등)에 반영된다. 배포 후 도감 설명 데이터를 고치면 재배포나 revalidate가 필요하다.
- **후속 관찰 대상**
  - 모바일에서는 탭이 숨겨져 패널의 `role="tabpanel"`이 보이지 않는 탭을 이름으로 가리킨다. 이름 계산은 정상이고 탭 정지점은 없앴지만, 낭독이 어색하면 구조를 다듬는다.
  - 모든 폼의 도감 설명이 RSC payload로 클라이언트에 넘어간다(dev 압축 전 약 23~46KB). 프로덕션 gzip 크기를 보고 서버 측 필터링을 검토한다.
  - BreadcrumbList 2단계 URL(`/detail`)이 404다(`pokemonJsonLd.ts`, 이번 변경과 무관한 기존 결함). 별도 브랜치에서 처리한다.
  - 숨긴 세대 문장의 검색 반영 여부는 배포 후 Search Console URL 검사로 확인한다.
