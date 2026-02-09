# Moves 페이지 쿼리파라미터 → Path 기반 URL 전환 (moves-path-migration)

## 📋 작업 개요

**브랜치**: `feature/1.33.0-moves-path-migration`
**작업 유형**: SEO 개선 / 리팩토링
**작업 기간**: 2026-02-09
**담당**: Claude Code

## 🎯 작업 목표

포켓몬 상세 페이지의 습득 기술(moves) 페이지에서 남아있던 쿼리파라미터(`selectVersion`, `movesType`)를 Path 기반 URL로 전환합니다. 이전에 `activeType`/`activeIndex`는 이미 Path 기반으로 전환 완료된 상태였으나, 버전 선택과 기술 유형 선택은 아직 쿼리파라미터 방식이었습니다. SEO 일관성과 canonical URL 정규화를 위해 전환합니다.

## ✨ 주요 변경사항

### 변경 1: URL 구조 변경

**변경 전**:

```
/detail/{id}/moves?selectVersion=5&movesType=MACHINE
/detail/{id}/moves/form/1?selectVersion=5&movesType=MACHINE
/detail/{id}/moves/region/0?selectVersion=5
```

**변경 후**:

```
/detail/{id}/moves                                          → 기본 (최신 버전, LEVELUP)
/detail/{id}/moves/machine                                  → 최신 버전, MACHINE
/detail/{id}/moves/version/{versionGroupId}                          → 버전 선택, LEVELUP
/detail/{id}/moves/version/{versionGroupId}/machine                  → 버전 선택, MACHINE
/detail/{id}/moves/form/{index}/version/{versionGroupId}             → 폼체인지 + 버전 선택
/detail/{id}/moves/form/{index}/version/{versionGroupId}/machine     → 폼체인지 + 버전 선택 + MACHINE
/detail/{id}/moves/region/{index}/version/{versionGroupId}           → 리전폼 + 버전 선택
/detail/{id}/moves/region/{index}/version/{versionGroupId}/machine   → 리전폼 + 버전 선택 + MACHINE
```

### 변경 2: 파싱 유틸리티 모듈 신규 생성

**신규 파일**: `src/module/movesParams.module.ts`

- `parseFormSegments(segments?)` — form/region 라우트의 `[[...segments]]` 파싱
- `buildMovesPath(params)` — Path 기반 URL 빌더 (서버/클라이언트 공유)

### 변경 3: DetailMovesContext 확장

**수정 파일**: `src/context/DetailMoves.context.tsx`

- `currentVersionGroupId?: number` 추가
- `currentMovesType?: 'LEVELUP' | 'MACHINE'` 추가

서버에서 파싱한 버전/기술 유형 값을 클라이언트로 전달하여, `useSearchParams` 대신 Context로 값을 읽도록 변경했습니다.

### 변경 4: 새 라우트 파일 3개 생성

| 파일                                              | 용도                     |
| ------------------------------------------------- | ------------------------ |
| `moves/machine/page.tsx`                          | 최신 버전 + MACHINE 고정 |
| `moves/version/[versionGroupId]/page.tsx`         | 특정 버전 + LEVELUP      |
| `moves/version/[versionGroupId]/machine/page.tsx` | 특정 버전 + MACHINE      |

### 변경 5: 기존 라우트 파일 3개 수정

| 파일                                    | 변경 내용                                                               |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `moves/page.tsx`                        | 레거시 쿼리파라미터 → Path URL redirect 추가, canonical URL 정리        |
| `moves/form/[[...segments]]/page.tsx`   | `[[...index]]` → `[[...segments]]` 리네이밍, `parseFormSegments()` 적용 |
| `moves/region/[[...segments]]/page.tsx` | form과 동일 패턴 적용                                                   |

### 변경 6: 클라이언트 컴포넌트 6개 수정

| 파일                                          | 변경 내용                                                          |
| --------------------------------------------- | ------------------------------------------------------------------ |
| Desktop `MovesHeader.container.tsx`           | `?selectVersion=X` → `/version/X` Path 기반, Context에서 버전 읽기 |
| Mobile `MovesHeader.container.tsx`            | 동일                                                               |
| Desktop `MovesTableContainer.tsx`             | `?movesType=X` → Path 기반 네비게이션, Context 사용                |
| Mobile `MovesTableContainer.tsx`              | 동일                                                               |
| Desktop `MachineLearnableSkill.component.tsx` | `?movesType=MACHINE` → `/machine`                                  |
| Mobile `MachineLearnableSkill.component.tsx`  | 동일                                                               |

### 변경 7: next.config.js 리다이렉트/캐싱 추가

**리다이렉트 (영구 301):**

- `?selectVersion=X&movesType=MACHINE` → `/version/X/machine`
- `?selectVersion=X` → `/version/X`
- `?movesType=MACHINE` → `/machine`

**캐싱 헤더:**

- `/detail/:pokemonId/moves/machine` → 1년 캐시
- `/detail/:pokemonId/moves/version/:versionGroupId` → 1년 캐시
- `/detail/:pokemonId/moves/version/:versionGroupId/machine` → 1년 캐시

## 📊 최적화 결과

| 항목                              | 변경 전                          | 변경 후                                  |
| --------------------------------- | -------------------------------- | ---------------------------------------- |
| 쿼리파라미터 의존 URL 수          | `selectVersion`, `movesType` 2개 | 0개                                      |
| Path 기반 라우트 수               | 3개 (기본, form, region)         | 6개 (+machine, version, version/machine) |
| canonical URL 쿼리파라미터        | 있음                             | 없음 (완전 Path 기반)                    |
| 클라이언트 `useSearchParams` 사용 | MovesHeader 2개, MovesTable 2개  | 0개 (Context 전환)                       |

## 🔧 기술적 세부사항

### 수정된 파일 전체 목록 (15개)

| #   | 파일                                                                         | 작업                         |
| --- | ---------------------------------------------------------------------------- | ---------------------------- |
| 1   | `src/module/movesParams.module.ts`                                           | **신규** - 파싱/빌더 유틸    |
| 2   | `src/context/DetailMoves.context.tsx`                                        | **수정** - Context 필드 추가 |
| 3   | `src/app/detail/[pokemonId]/moves/machine/page.tsx`                          | **신규**                     |
| 4   | `src/app/detail/[pokemonId]/moves/version/[versionGroupId]/page.tsx`         | **신규**                     |
| 5   | `src/app/detail/[pokemonId]/moves/version/[versionGroupId]/machine/page.tsx` | **신규**                     |
| 6   | `src/app/detail/[pokemonId]/moves/page.tsx`                                  | **수정**                     |
| 7   | `src/app/detail/[pokemonId]/moves/form/[[...segments]]/page.tsx`             | **수정** (리네이밍)          |
| 8   | `src/app/detail/[pokemonId]/moves/region/[[...segments]]/page.tsx`           | **수정** (리네이밍)          |
| 9   | `src/container/desktop/.../MovesHeader.container.tsx`                        | **수정**                     |
| 10  | `src/container/mobile/.../MovesHeader.container.tsx`                         | **수정**                     |
| 11  | `src/container/desktop/.../MovesTableContainer.tsx`                          | **수정**                     |
| 12  | `src/container/mobile/.../MovesTableContainer.tsx`                           | **수정**                     |
| 13  | `src/container/desktop/.../MachineLearnableSkill.component.tsx`              | **수정**                     |
| 14  | `src/container/mobile/.../MachineLearnableSkill.component.tsx`               | **수정**                     |
| 15  | `next.config.js`                                                             | **수정** - 리다이렉트 + 캐싱 |

## ✅ 테스트 체크리스트

- [ ] `npm run lint` 통과 확인
- [ ] `npm run build` 빌드 성공 확인
- [ ] 기본 기술 페이지 (`/detail/{id}/moves`) 정상 동작
- [ ] 머신 기술 페이지 (`/detail/{id}/moves/machine`) 정상 동작
- [ ] 버전 선택 페이지 (`/detail/{id}/moves/version/{ver}`) 정상 동작
- [ ] 버전 선택 + 머신 페이지 (`/detail/{id}/moves/version/{ver}/machine`) 정상 동작
- [ ] 폼체인지 기술 페이지 (`/detail/{id}/moves/form/{idx}/...`) 정상 동작
- [ ] 리전폼 기술 페이지 (`/detail/{id}/moves/region/{idx}/...`) 정상 동작
- [ ] 레거시 `?selectVersion=X` URL 접근 시 Path URL로 301 리다이렉트
- [ ] 레거시 `?movesType=MACHINE` URL 접근 시 `/machine`으로 301 리다이렉트
- [ ] 버전 선택 링크 클릭 시 Path 기반 URL 이동
- [ ] LEVELUP/MACHINE 토글 클릭 시 Path 기반 URL 이동
- [ ] 상세 페이지에서 "모든 세대 기술 보러가기" 링크가 `/machine` 경로 사용
- [ ] SEO 메타데이터의 canonical URL에 쿼리파라미터 없는지 확인

## 📝 향후 작업

- form/region 하위에서도 `selectVersion` 쿼리파라미터의 next.config.js 레벨 301 리다이렉트 필요 시 추가 (현재는 page.tsx 내부 redirect로 처리)

## 🚀 머지 정보

**머지 대상**: `feature/1.33.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- `[[...index]]` → `[[...segments]]` 리네이밍은 catch-all 세그먼트에서 index뿐 아니라 version/machine도 파싱하기 위함
- 레거시 쿼리파라미터 호환을 위해 page.tsx 내부에서 `redirect()` 처리 + next.config.js에서 301 리다이렉트 이중 처리
- 클라이언트 컴포넌트에서 `useSearchParams()` 제거로 불필요한 Suspense 경계 감소 가능
