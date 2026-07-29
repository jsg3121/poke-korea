---
slug: 1-54-0-champions-fix
title: '[1.54.0] 챔피언스 데이터 원천 전환 후속 정합 — 폼 배지·정렬 라벨·상세 포맷 전환·도감 링크 버그'
description: '챔피언스 데이터 원천 전환(championsbattledata) 후속으로 남은 정합성 이슈를 전수 점검해 수정했다. 도감 카드에 메가/리전 폼 배지를 포켓볼 위로 얹고, 동작하지 않던 사용률 정렬 라벨을 순위순으로 정정하고, 잔존 사용률 문구를 채택 순위로 통일했다. 메가 폼의 도감 보기 링크가 일반 상세로 새던 버그를 고치고, 상세 페이지에 더블/싱글 포맷 전환 탭을 신규 추가했다.'
authors: [jsg3121, claude]
tags: [bug-fix, ux, feature, seo]
---

# 1.54.0 — 챔피언스 데이터 원천 전환 후속 정합

> **작업 일자**: 2026-07-29
> **작업 브랜치**: `feature/1.54.0-champions-fix`
> **선행 작업**: [챔피언스 데이터 원천 변경 대응](/1-54-0-champions-source-change) (PR #195)

## 📋 작업 개요

**작업 유형**: 데이터 원천 전환 후속 정합 (버그 수정 + UI 개선 + 신규 기능)
**담당**: jsg3121 + Claude

챔피언스 메타 데이터가 실게임 랭크전 데이터(championsbattledata)로 전환된 뒤,
1차 대응(PR #195)에서 처리되지 못하고 **남은 정합성 이슈를 전수 점검**했다. 화면
영역별(도감 카드·티어·홈·상세·메타/SEO)로 나눠 대조한 결과 실질 수정 대상 7건과
추가 개선 요청 3건을 확인해 반영했다.

## 🎯 해결한 문제

- **[Major] 동작하지 않는 "사용률순" 정렬 옵션 노출** — 도감 정렬 드롭다운이
  `사용률순`을 기본으로 노출하나, 실게임 데이터는 사용률 %를 제공하지 않고 채택
  순위(usageRank)만 준다. 라벨을 `순위순`으로 정정해 실제 데이터와 정합화(정렬
  자체는 순위/도감번호 두 방식 유지)
- **[Major] 메가 폼의 "도감 보기" 링크가 일반 상세로 이동** — 메가리자몽X(formIndex
  0)에서 "도감 보기"를 누르면 메가가 아닌 일반 리자몽 상세로 빠졌다. `formIndex === 0`
  분기 버그
- **[Minor] 화면에 잔존한 "사용률" 문구** — 퀵링크 카드(`티어 분류와 사용률`)·홈
  A티어 섹션 캡션(`고 사용률 포켓몬`)이 실제 데이터(순위/티어)와 불일치. 채택
  순위 기반 표현으로 정정
- **[Minor] 메타/JSON-LD의 "사용률" 잔존** — 챔피언스 홈·티어 메타 description과
  구조화 데이터(JSON-LD)가 "사용률"을 핵심 데이터로 소개. 채택 순위/티어로 정정
- **[Minor] 접근성 라벨 옛 용어** — 티어 아이템 순위 배지의 스크린리더 라벨이
  `사용률 순위`. 다른 화면과 통일해 `채택 순위`로 정정

## ✨ 주요 변경

### 1. 도감 카드 폼 배지 — 포켓볼 위로 이동 (신규)

메가진화가 도감에 별도 항목으로 노출되면서, 사용자가 폼 종류를 한눈에 구분할 수
있도록 카드에 폼 배지(`메가`/`리전`)를 추가했다. 헤더 인라인에 두면 배지 폭만큼
No.가 밀려 긴 이름이 불필요하게 줄바꿈되므로, 셸이 제공하는 `ballBadge` 슬롯(포켓볼
위 겹침용)을 활용해 포켓볼 좌상단에 얹었다. DS 셸(`PokemonCardShell`) 코드는 손대지
않았다.

배지 판별 로직은 티어 아이템에만 있던 것을 공용 헬퍼 `getChampionsFormBadge`로
추출해 도감 카드·티어 아이템이 공유한다. 판별 근거도 `formCode.startsWith('M')`(메가
이외 코드와 충돌 위험)에서 `formType` enum 우선으로 개선했다.

**변경 전** (티어 아이템 지역 함수):

```tsx
// formCode 문자열로 메가 판별 — 충돌 위험
const getFormBadge = (formCode, region) => {
  if (formCode && formCode.startsWith('M')) return { label: '메가', ... }
  if (region) return { label: '리전', ... }
  return null
}
```

**변경 후** (`championsFormat.util.ts` 공용 헬퍼):

```tsx
// formType enum 우선 판별, 도감 카드·티어 아이템 공유
export const getChampionsFormBadge = (formType, region) => {
  if (formType === 'MEGA') return { label: '메가', ... }
  if (formType === 'REGION' || (!formType && region)) return { label: '리전', ... }
  return null
}
```

도감번호 폰트는 데스크톱에서 16px → 14px(`desktop:text-sm`)로 축소하고 모바일(12px,
`text-xs`)은 유지했다.

### 2. 정렬 라벨 정합화 — 사용률순 → 순위순

```tsx
// 변경 전
{ value: 'usage', label: '사용률순' },
// 변경 후 — 쿼리값 'usage'는 백엔드 정렬 인자 하위호환 위해 유지
{ value: 'usage', label: '순위순' },
```

### 3. 메가 "도감 보기" 링크 버그 수정

일반 도감(`/detail`)의 폼 라우트는 "index 0 = 폼 경로 유지(`/mega`, `/region`,
`/form`)"인데, 챔피언스 쪽은 REGION만 이 규칙을 따르고 MEGA·NORMAL은 index 0을
base로 떨궜다.

**변경 전**:

```tsx
case 'MEGA':
  return index > 0 ? `${baseUrl}/mega/${index}` : baseUrl // index 0 → 일반 상세
```

**변경 후**:

```tsx
case 'MEGA':
  return index > 0 ? `${baseUrl}/mega/${index}` : `${baseUrl}/mega`
```

### 4. 상세 페이지 더블/싱글 포맷 전환 탭 (신규)

상세 페이지에 현재 포맷을 표시하고 상대 포맷으로 전환하는 탭(`ChampionsDetailFormatSwitch`)을
추가했다. 홈/도감/티어의 포맷 탭은 포맷 "홈"으로 이동하지만, 상세는 **현재 보고 있는
포켓몬/폼을 유지한 채** 상대 포맷 상세로 가야 하므로 `buildChampionsDetailHref`로
상세 경로를 다시 계산한다.

championsbattledata 데이터는 double·single이 동일한 포켓몬 풀(각 310종, 교집합 100%)을
쓰므로 어느 포켓몬이든 상대 포맷 상세가 항상 존재한다. 따라서 존재 확인 쿼리 없이
단순 링크로 전환한다.

### 5. 문구·메타·접근성 정합화

- 퀵링크 카드: `티어 분류와 사용률` → `티어 분류와 채택 순위`
- 홈 A티어 섹션 캡션: `S티어 제외 고 사용률 포켓몬` → `S티어 제외 상위 채택 포켓몬`
- 챔피언스 홈/티어 메타 description·JSON-LD: "사용률" → 채택 순위/티어
- 티어 아이템 순위 배지 `aria-label`: `사용률 순위` → `채택 순위`

## 🔧 기술적 세부사항

**신규 파일**

- `src/components/champions/ChampionsDetailFormatSwitch.component.tsx` — 상세 전용
  더블/싱글 전환 탭

**수정 파일 (9개)**

| 파일 | 변경 |
| --- | --- |
| `utils/championsFormat.util.ts` | `getChampionsFormBadge` 공용 헬퍼 추가 |
| `components/champions/ChampionsPokemonCard.component.tsx` | 폼 배지(ballBadge)·도감번호 폰트 |
| `components/champions/ChampionsTierPokemonItem.component.tsx` | 공용 헬퍼 사용·aria-label |
| `components/champions/ChampionsPokedexSortSelect.component.tsx` | 정렬 라벨 |
| `components/champions/ChampionsQuickLinks.component.tsx` | 퀵링크 문구 |
| `container/champions/ChampionsDetail.container.tsx` | 포맷 전환 탭 배치·도감 링크 버그 |
| `container/champions/ChampionsHome.container.tsx` | A티어 캡션 |
| `app/champions/_metadata/championsMetadata.ts` | 메타 description |
| `app/champions/[format]/page.tsx` | JSON-LD description |

**검증**: `npx tsc --noEmit`·`npx eslint` 전체 통과.

## 📌 참고 사항

- **메가 폼 전환 탭(작업 중 확인)**: 상세 히어로 상단 폼 전환 탭이 리전은 뜨나 메가는
  안 뜨는 이슈를 조사한 결과, 백엔드 `formSiblings` 응답에서 메가 형제가 누락된 것이
  원인이었다(프론트 `ChampionsFormTab`은 formSiblings만 오면 폼 구분 없이 탭을 그림).
  매일 갱신되는 실게임 데이터라 재검증 시점에는 메가 형제가 정상 포함되어 탭이 노출됐다.
  프론트 수정 없이 백엔드 데이터 갱신으로 해소됨.
- **팀 코어 카드의 "사용률" 표기는 의도적으로 유지**했다. 이 값은 항상 null이 된
  포켓몬 사용률이 아니라 팀 조합의 실재하는 채택률(%)(`ChampionsTeamCore.usageRate:
  Float!`, non-null)이라 표현이 데이터와 어긋나지 않는다.
- **대회 페이지의 "VGC"/"BSS" 표기도 유지**했다. 포괄 검색어 노출수 급락 대응으로
  의도적으로 남긴 표기다(관련 주석 `championsMetadata.ts`).
