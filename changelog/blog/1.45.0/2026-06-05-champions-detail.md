---
slug: 1-45-0-champions-detail
title: '[1.45.0] 챔피언스 상세 페이지 Phase 4 — 포맷 분리 + 폼 라우트 + 폼 탭 + 메타 요약'
description: '/champions/list/[pokemonId] 를 포맷별·폼별 라우트로 전환, formSiblings 기반 폼 탭 신설, 헤더 메타 요약 바 도입, 6개 카드 컴포넌트의 폼별 정확 라우팅, BASE 폼 자동 리다이렉트.'
authors: [jsg3121, claude]
tags: [feature, champions, breaking-change]
---

# 1.45.0 — 챔피언스 상세 페이지 Phase 4

> **작업 일자**: 2026-06-05
> **작업 브랜치**: `feature/1.45.0-champions-detail`
> **연결 SPEC**: `.claude/specs/champions-frontend-implementation-plan.md` (Phase 4)

## 📋 작업 개요

**작업 유형**: 라우트 구조 변경 + 폼 라우트 5개 신설 + 신규 컴포넌트 + 폼 정확 라우팅 전체 적용
**담당**: jsg3121 + Claude

`champions-frontend-implementation-plan.md` Phase 4 (상세) 단계 — 1.45.0 의 **가장 큰 작업**.
백엔드의 신규 응답 (`formSiblings`, `formType` 필드 다수 추가) 을 활용해 폼별 라우트 분리 +
폼 간 빠른 전환 UX 를 도입했다.

ux-designer 에이전트로 정보 위계 검토 → ui-publisher 에이전트로 정적 시안 → 사용자 피드백 반영
사이클을 거쳐 본 구현 진입했다.

<!-- truncate -->

## 🎯 라우트 구조 변경

| 변경 | 처리 |
| --- | --- |
| 신규 BASE 라우트 | `/champions/[format]/list/[pokemonId]/page.tsx` |
| 신규 폼 라우트 (5종) | `/champions/[format]/list/[pokemonId]/(form)/{mega,region,gigantamax,form}/...` |
| 기존 라우트 삭제 | `/champions/list/[pokemonId]/` 디렉토리 전체 |
| 301 리다이렉트 | `/champions/list/:pokemonId` → `/champions/vgc/list/:pokemonId` |
| sitemap | `/champions/vgc/list/:id`, `/champions/bss/list/:id` 추가 |

### 폼 라우트 패턴

```
/champions/[format]/list/[pokemonId]                  # BASE 폼
/champions/[format]/list/[pokemonId]/mega             # 메가 (기본)
/champions/[format]/list/[pokemonId]/mega/[formCode]  # 메가 (formCode 지정, 예: 메가X/Y)
/champions/[format]/list/[pokemonId]/region           # 리전
/champions/[format]/list/[pokemonId]/region/[formCode]
/champions/[format]/list/[pokemonId]/gigantamax       # 거다이맥스
/champions/[format]/list/[pokemonId]/form             # 일반 폼
/champions/[format]/list/[pokemonId]/form/[formCode]
```

기존 `/detail/[pokemonId]/(form)/*` 패턴과 동일한 그룹 라우트 구조.

### 공통 헬퍼 추출

라우트 7개가 동일한 흐름이라 중복 제거:
- `_fetch/fetchChampionsDetail.ts` — Apollo 쿼리 호출
- `_fetch/renderChampionsDetail.tsx` — 라우트 → 컨테이너 진입 공통 로직

## ⭐ 신규 섹션 — 폼 탭 + 메타 요약 바

### `ChampionsFormTab` 신규

백엔드 `formSiblings` 응답을 활용해 폼 탭 자동 생성:

```
[리자몽 D] [메가리자몽X C] [메가리자몽Y S]
                              ↑ isCurrent
```

- 각 탭에 폼 이름 + 티어 뱃지 (`ChampionsTierBadge` 재사용)
- `isCurrent: true` 인 탭이 active 상태 (밝은 강조)
- 폼이 1개뿐 (자기 자신만) 인 경우 영역 미노출
- 모바일 가로 스크롤 대응

### `ChampionsDetailMetaSummaryBar` 신규

헤더 카드 안에 메타 요약 한 줄 추가:

```
[티어 뱃지]   사용률 31.8%   승률 53.9%   #4위
```

- 타입 그라데이션 배경 위에 반투명 어두운 오버레이 (`bg-black-1/20`)
- 데스크탑 가로 4칸 / 모바일 2x2 그리드
- 결측 처리:
  - `winRate` null → `-` 표시
  - `usageRank` null → 영역 자체 미노출
  - 전부 null → 컴포넌트 자체 미노출

## 🔄 폼별 정확 라우팅 — 6개 컴포넌트 전체 갱신

### 문제

기존 카드 클릭 시 `pokemonId` 만으로 URL 생성 → 메가/리전 폼 카드 클릭해도 BASE 페이지로 진입.

예: 티어 페이지에서 **메가플라엣테** 카드 클릭 → `/champions/vgc/list/670` (BASE 플라엣테) →
챔피언스 메타 데이터가 없어 빈 페이지 노출.

### 해결

`buildChampionsDetailHref` utils 함수로 `formatSlug + pokemonId + formType + formCode` 조합을
정확한 폼 라우트로 매핑.

```typescript
buildChampionsDetailHref({
  formatSlug: 'vgc',
  pokemonId: 670,
  formType: 'MEGA',
  formCode: 'M0670087',
})
// → '/champions/vgc/list/670/mega/M0670087'
```

### 백엔드 변경 의존

각 응답 타입에 `formType` 필드가 필요 — 백엔드 협업으로 추가:
- `ChampionsMetaStats` + `formType` (홈/티어 카드용)
- `ChampionsMetaPartner` + `formType` (추천 파트너용)
- `ChampionsTeamMember` + `formType` (인기 조합 멤버용)
- `ChampionsPokemon` + `formType` (도감 카드용 — 이전부터 존재)

### 적용 컴포넌트

| 컴포넌트 | 데이터 출처 |
| --- | --- |
| `ChampionsFormTab` | `formSiblings` |
| `ChampionsPokemonCard` | `ChampionsPokemonCard` Fragment |
| `ChampionsTierPokemonItem` | `ChampionsMetaSummary` Fragment |
| `ChampionsTopCard` | `ChampionsMetaSummary` Fragment |
| `ChampionsPartnerList` | `ChampionsMetaPartner` 배열 |
| `ChampionsTeamCoreCard` / `ChampionsTierTeamCoreCard` | `ChampionsTeamMember` 배열 |

### 호출 체인 갱신 — `formatSlug` props 전파

부모 컨테이너에서 자식 컴포넌트로 `formatSlug` 를 전달하기 위해 props 추가:
- `ChampionsHeroSection`, `ChampionsMetaSection`(데/모), `ChampionsTierGroup`
- 각 페이지 container (Home/Pokedex/Tier 데스크탑/모바일)
- `HomeChampions`(데/모) 는 메인 페이지에서 사용되므로 `CHAMPIONS_DEFAULT_FORMAT_SLUG` (vgc) 사용

## 🔁 BASE 폼 자동 리다이렉트

플라엣테처럼 BASE 폼에는 챔피언스 데이터가 없지만 메가플라엣테에는 있는 케이스 대응:

`renderChampionsDetail` 헬퍼에서:
1. 백엔드 응답의 `meta === null` 확인
2. `formSiblings` 중 `usageRate` 가장 높은 폼 찾기
3. Next.js `redirect()` 로 해당 폼 페이지로 자동 이동

예시:
```
사용자: /champions/vgc/list/670 (BASE 플라엣테) 진입
       ↓ 백엔드 응답: meta=null, formSiblings=[메가플라엣테(A,23.92%), 영원의꽃(D,0.3%)]
서버: redirect('/champions/vgc/list/670/mega/M0670087')
사용자: 메가플라엣테 페이지 정상 노출
```

직접 URL 입력이나 외부 검색에서 진입한 BASE 케이스에서 빈 페이지가 노출되는 문제를 해소.

## 🎨 UI 보강

### `ChampionsDetail` 컨테이너 재구성

| 항목 | 변경 |
| --- | --- |
| 폼 탭 통합 | 헤더 카드 위에 `ChampionsFormTab` 배치 |
| 메타 요약 바 통합 | 헤더 카드 안 (타입 그라데이션 위 반투명 오버레이) |
| `displayName` 합성 로직 제거 | `pokemon.name` 백엔드 응답 그대로 사용 (Phase 2/3 결정 잔존 정리) |
| 브레드크럼 갱신 | 포맷 라우트 반영 (`/champions/vgc/list` → 이름) |
| "도감 보기" 버튼 축소 | 큰 버튼 → 브레드크럼 우측 작은 텍스트 링크 |
| 빈 메타 폴백 링크 | `/champions/${formatSlug}/list` 포맷 경유 |

### `ChampionsFormatTab` 활성/비활성 반전

기존 활성 = `bg-primary-1` (어두운 네이비) 는 다크 페이지 배경과 동화되어 비활성처럼 보이는 문제.

```
활성: bg-primary-4 text-primary-1 border-primary-4 (밝은 강조, 다크 배경 위에서 명확)
비활성: bg-transparent text-primary-3 border-primary-3 (어두운 외곽선만)
```

홈/리스트/티어 페이지 전체 영향.

### `ChampionsTierTeamCoreCard` 순위 색상 → 메달 체계 일치

기존 #1 = emerald, #2 = amber, #3 = blue → `ChampionsTierBadge` 메달 체계와 불일치.

변경 후:
- #1 골드 (`from-amber-400 to-amber-600`)
- #2 실버 (`from-slate-300 to-slate-500`)
- #3 브론즈 (`from-amber-600 to-amber-800`)

### 상세 페이지에서 FormatTab 제거

폼 탭이 핵심 진입점이고 FormatTab 은 한 단계 위 (홈/리스트/티어) 에서 이미 선택된 상태로
진입하는 경우가 대부분이라 중복 노출 제거.

## 📊 GraphQL Fragment 변경

```graphql
fragment ChampionsFormSibling on ChampionsFormSibling { ... }  # 신규
fragment ChampionsPokemonDetail on ChampionsPokemonDetail {
  ...
  formSiblings { ...ChampionsFormSibling }                     # 신규 필드
  ...
}
fragment ChampionsMetaSummary on ChampionsMetaStats {
  ...
  formType                                                      # 신규
  ...
}
fragment ChampionsMetaPartner on ChampionsMetaPartner {
  ...
  formType                                                      # 신규
  ...
}
fragment ChampionsTeamMember on ChampionsTeamMember {
  ...
  formType                                                      # 신규
  ...
}
```

## 🤖 사용한 에이전트 / 스킬

| 에이전트 | 사용 시점 | 산출물 |
| --- | --- | --- |
| `ux-designer` | 정보 위계 검토 + 폼 라우트 UX 옵션 분석 | 옵션 비교 보고서 (페이지 내부 탭 vs 라우트 분리 + 폼 탭) |
| `ui-publisher` (시안 모드) | 정적 HTML/CSS 시안 (5개 파일) | `mockups/champions-detail/` (본 구현 완료 후 폐기) |

### 백엔드 협업 사이클

1. 초기 사전 조사에서 `formSiblings` 필드가 백엔드에 없음을 확인 → 폼 탭 구현 막힘
2. 사용자가 백엔드에 추가 요청 → `formSiblings` + `formType` 신규 응답 추가
3. EV/카운터/레이팅별 사용률 차트 등 SPEC 의 일부 항목은 백엔드 데이터 미제공으로 Phase 4 범위에서 제외 결정
4. Apollo 캐시 정규화 충돌 해소: 백엔드가 `id` 를 폼별 고유 문자열 (`6:MEGA:M0006003`) 로 변경

### 시안 사이클 (사용자 피드백 다수 반영)

1. UX 보고서 검토 → 폼 라우트 UX 옵션 C (라우트 분리 + 폼 탭) 결정
2. EV 스프레드 백엔드 데이터 의미 미확정 → Phase 4 에서 제외
3. v1 시안 → 사용자 피드백 (티어 색상 매핑, 모바일 메타 요약 2x2 그리드 등) 반영
4. 본 구현 진입 후 4가지 추가 조정 (FormatTab 반전, 코어 순위 색상 메달 일치, 상세 페이지 FormatTab 제거)

## 🔧 검증

- `npm run lint`: 챔피언스 관련 신규 경고 없음
- `npx tsc --noEmit`: 통과
- `npm run build`: 성공 — `/champions/[format]/list/[pokemonId]` + 7개 폼 라우트 정상 생성
- dev 서버에서 다음 시나리오 모두 확인:
  - `/champions/vgc/list/6` 진입 + 메가X/Y 폼 전환
  - `/champions/vgc/list/670` 자동 리다이렉트 → 메가플라엣테
  - 티어/리스트/홈에서 메가/리전 폼 카드 클릭 → 정확 폼 페이지 진입
  - 추천 파트너 / 인기 조합 멤버 클릭 → 정확 폼 페이지 진입
  - `/champions/list/6` → 301 → `/champions/vgc/list/6`

## 🔜 후속 작업 (Phase 5)

| Phase | 작업 브랜치 | 내용 |
| --- | --- | --- |
| Phase 5 | `feature/1.45.0-champions-tournaments` | 대회 신규 페이지 |

### Phase 4 에서 제외된 항목 (백엔드 의존)

- **EV 스프레드 섹션**: 백엔드 응답값 (합계 66) 의 의미가 일반 EV 시스템 (합계 510) 과 달라 보류
- **카운터 섹션**: 백엔드 데이터 빈 배열 (수집 미진행)
- **레이팅별 사용률 차트**: Phase 1 Breaking 으로 백엔드 필드 자체 제거됨

### 메가리자몽Y 티어 불일치 (백엔드 이슈 보고됨)

`formSiblings.tier` 와 `meta.tier` 가 다름 (S vs A). 백엔드에서 별도 처리 예정.
