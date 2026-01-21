# SEO Path 기반 URL 전환 (seo-path-url)

## 📋 작업 개요

**브랜치**: `feature/1.30.0-seo-path-url`
**작업 유형**: SEO 개선 / 리팩토링
**작업 기간**: 2026-01-15
**담당**: Claude Code

## 🎯 작업 목표

포켓몬 상세 페이지의 메가진화, 리전폼 URL을 쿼리 파라미터 방식에서 Path 기반으로 전환하여 SEO 최적화

### 변경 전 URL 패턴

```
# 상세 페이지
/detail/6?activeType=mega
/detail/6?activeType=mega&activeIndex=1
/detail/19?activeType=region
/detail/25?activeIndex=1  # 기본폼 (폼체인지)

# 기술 페이지
/detail/19/moves?activeType=region
/detail/19/moves?activeType=region&activeIndex=1
/detail/25/moves?activeIndex=1  # 기본폼 기술 (폼체인지)
```

### 변경 후 URL 패턴

```
# 상세 페이지
/detail/6/mega
/detail/6/mega/1
/detail/19/region
/detail/25/form/1  # 기본폼 (폼체인지)

# 기술 페이지
/detail/19/moves/region
/detail/19/moves/region/1
/detail/25/moves/form/1  # 기본폼 기술 (폼체인지)
```

## ✨ 주요 변경사항

### 1. 라우트 구조 변경

**변경 전**:

```
src/app/detail/
├── [pokemonId]/
│   └── page.tsx  # 쿼리 파라미터로 모든 케이스 처리
```

**변경 후**:

```
src/app/detail/
├── [pokemonId]/
│   ├── (form)/
│   │   ├── modules/
│   │   │   ├── parseFormParams.ts      # URL 파라미터 파싱 모듈
│   │   │   ├── fetchDetailData.ts      # 데이터 페칭 모듈
│   │   │   └── generateMetadata.ts     # 메타데이터 생성 모듈
│   │   ├── form/
│   │   │   └── [[...index]]/
│   │   │       └── page.tsx            # 기본폼 페이지 (폼체인지)
│   │   ├── mega/
│   │   │   └── [[...index]]/
│   │   │       └── page.tsx            # 메가진화 페이지
│   │   ├── region/
│   │   │   └── [[...index]]/
│   │   │       └── page.tsx            # 리전폼 페이지
│   │   └── page.tsx                    # 기본폼 페이지
│   ├── moves/
│   │   ├── page.tsx                    # 기본폼 기술 페이지
│   │   ├── form/
│   │   │   └── [[...index]]/
│   │   │       └── page.tsx            # 기본폼 기술 페이지 (폼체인지)
│   │   └── region/
│   │       └── [[...index]]/
│   │           └── page.tsx            # 리전폼 기술 페이지
│   └── opengraph-image.tsx
```

- Route Groups `(form)`을 사용하여 기존 `moves` 라우트와의 충돌 해결
- `[[...index]]` Optional Catch-all Segment로 formIndex 처리
- 비즈니스 로직을 `modules/` 폴더로 분리하여 코드 가독성 향상

### 2. 비즈니스 로직 모듈화

| 모듈                  | 역할                                |
| --------------------- | ----------------------------------- |
| `parseFormParams.ts`  | URL path/query 파라미터에서 값 추출 |
| `fetchDetailData.ts`  | activeType별 최적화된 데이터 페칭   |
| `generateMetadata.ts` | SEO 메타데이터 생성                 |

### 3. 쿼리 최적화

activeType별 필요한 데이터만 페칭하도록 최적화:

| activeType | 페칭 데이터                                     |
| ---------- | ----------------------------------------------- |
| normal     | normalForm + versionGroup + normalFormImageList |
| mega       | megaEvolution 데이터만                          |
| region     | regionForm + versionGroup                       |

### 4. URL 파라미터 처리 방식 변경

- `activeType`, `activeIndex` 쿼리 파라미터 → Path 세그먼트로 변경
- `shinyMode`는 동일 콘텐츠의 다른 표현이므로 쿼리 파라미터 유지
- 기본폼의 `activeIndex`는 쿼리 파라미터로 유지 (이미지 슬라이드 위치)

### 5. 컴포넌트 수정

- **Detail.context.tsx**: 서버에서 `activeType`, `activeIndex` props로 전달받아 처리
- **스위치 컴포넌트**: Context에서 값을 가져와 Path 기반 URL 생성
- **검색 결과 링크**: Path 기반 URL 생성 로직 변경
- **이미지 슬라이더**: 슬라이드 변경 시 Path 기반 URL로 업데이트

### 6. 301 리다이렉트 설정

기존 쿼리 파라미터 URL → 새 Path URL로 영구 리다이렉트 (next.config.js)

```javascript
// 예시 - 상세 페이지
/detail/6?activeType=mega → /detail/6/mega
/detail/6?activeType=mega&activeIndex=1 → /detail/6/mega/1
/detail/19?activeType=region → /detail/19/region
/detail/25?activeIndex=1 → /detail/25/form/1  // 기본폼 (폼체인지)

// 예시 - 기술 페이지
/detail/19/moves?activeType=region → /detail/19/moves/region
/detail/19/moves?activeType=region&activeIndex=1 → /detail/19/moves/region/1
/detail/25/moves?activeIndex=1 → /detail/25/moves/form/1  // 기본폼 기술 (폼체인지)
```

## 📊 SEO 개선 효과

| 항목            | 개선 내용                           |
| --------------- | ----------------------------------- |
| 크롤링 우선순위 | 독립적인 페이지로 인식              |
| 인덱싱 확실성   | 쿼리 파라미터 무시 가능성 제거      |
| URL 가독성      | 직관적인 URL 구조                   |
| 키워드 노출     | URL에 mega, region 키워드 직접 노출 |

## 📊 코드 최적화 결과

| 항목               | 변경 전                 | 변경 후              |
| ------------------ | ----------------------- | -------------------- |
| page.tsx 라인 수   | ~388줄 (단일 파일)      | ~120줄 (페이지당)    |
| 비즈니스 로직 분리 | 페이지 컴포넌트에 혼재  | modules/ 폴더로 분리 |
| 데이터 페칭        | 모든 데이터 한번에 페칭 | activeType별 최적화  |
| 코드 재사용성      | 낮음                    | 높음 (모듈 공유)     |

## 🔧 기술적 세부사항

### 수정 파일 목록

| 파일                                                                                          | 변경 내용                            |
| --------------------------------------------------------------------------------------------- | ------------------------------------ |
| `src/app/detail/[pokemonId]/(form)/page.tsx`                                                  | 신규 - 기본폼 페이지                 |
| `src/app/detail/[pokemonId]/(form)/form/[[...index]]/page.tsx`                                | 신규 - 기본폼 페이지 (폼체인지)      |
| `src/app/detail/[pokemonId]/(form)/mega/[[...index]]/page.tsx`                                | 신규 - 메가진화 페이지               |
| `src/app/detail/[pokemonId]/(form)/region/[[...index]]/page.tsx`                              | 신규 - 리전폼 페이지                 |
| `src/app/detail/[pokemonId]/(form)/modules/parseFormParams.ts`                                | 신규 - URL 파라미터 파싱             |
| `src/app/detail/[pokemonId]/(form)/modules/fetchDetailData.ts`                                | 신규 - 데이터 페칭 로직              |
| `src/app/detail/[pokemonId]/(form)/modules/generateMetadata.ts`                               | 신규 - 메타데이터 생성 로직          |
| `src/app/detail/[pokemonId]/page.tsx`                                                         | 삭제                                 |
| `src/context/Detail.context.tsx`                                                              | activeType, activeIndex props 추가   |
| `src/container/desktop/header/header.search/**/ResultListData.tsx`                            | Path URL 생성 (NORMAL_FORM 포함)     |
| `src/container/mobile/header/header.search/**/ResultListData.tsx`                             | Path URL 생성 (NORMAL_FORM 포함)     |
| `src/components/ability/PokemonByAbilityCard.component.tsx`                                   | href 객체 → 경로 문자열 변환         |
| `src/components/moves/PokemonBySkillCard.component.tsx`                                       | href 객체 → 경로 문자열 변환         |
| `src/app/sitemap.ts`                                                                          | 메가/리전 URL 경로 기반으로 변경     |
| `src/container/desktop/detail/detail.summary/components/MegaSwitch.component.tsx`             | Path href 생성                       |
| `src/container/desktop/detail/detail.summary/components/RegionSwitch.component.tsx`           | Path href 생성                       |
| `src/container/desktop/detail/detail.summary/components/ShinySwitch.component.tsx`            | Path href 생성                       |
| `src/container/mobile/detail/detail.summary/components/MegaSwitch.component.tsx`              | Path href 생성                       |
| `src/container/mobile/detail/detail.summary/components/RegionSwitch.component.tsx`            | Path href 생성                       |
| `src/container/mobile/detail/detail.summary/components/ShinySwitch.component.tsx`             | Path href 생성                       |
| `src/container/desktop/detail/detail.summary/summary.pokemonImage/PokemonImage.compoment.tsx` | Path URL 업데이트                    |
| `src/container/mobile/detail/detail.summary/summary.pokemonImage/PokemonImage.compoment.tsx`  | Path URL 업데이트                    |
| `src/container/desktop/detail/detail.moves/moves.header/MovesHeader.container.tsx`            | 상세 정보 링크 Path 기반 생성        |
| `src/container/mobile/detail/detail.moves/moves.header/MovesHeader.container.tsx`             | 상세 정보 링크 Path 기반 생성        |
| `src/container/desktop/detail/detail.baseInfo/baseInfo.learnableSkill/LevelLearnableSkill.component.tsx` | 기술 링크 Path 기반 생성 |
| `src/container/desktop/detail/detail.baseInfo/baseInfo.learnableSkill/MachineLearnableSkill.component.tsx` | 기술 링크 Path 기반 생성 |
| `src/container/mobile/detail/detail.baseInfo/baseInfo.learnableSkill/LevelLearnableSkill.component.tsx` | 기술 링크 Path 기반 생성 |
| `src/container/mobile/detail/detail.baseInfo/baseInfo.learnableSkill/MachineLearnableSkill.component.tsx` | 기술 링크 Path 기반 생성 |
| `src/app/detail/[pokemonId]/moves/page.tsx`                                                   | region, activeIndex 쿼리 파라미터 리다이렉트 추가 |
| `src/app/detail/[pokemonId]/moves/form/[[...index]]/page.tsx`                                 | 신규 - 기본폼 기술 페이지 (폼체인지) |
| `src/app/detail/[pokemonId]/moves/region/[[...index]]/page.tsx`                               | 신규 - 리전폼 기술 페이지            |
| `src/module/generateDetailSeoMetaData.ts`                                                     | 캐노니컬 URL Path 기반 생성 (form 포함) |
| `next.config.js`                                                                              | 301 리다이렉트 규칙 + 캐시 헤더 추가 (form 포함) |

## ✅ 테스트 체크리스트

- [x] 빌드 성공 확인
- [x] 기본 포켓몬 상세 페이지 접근 (/detail/6)
- [x] 메가진화 페이지 접근 (/detail/6/mega)
- [x] 메가진화 두번째 폼 접근 (/detail/6/mega/1)
- [x] 리전폼 페이지 접근 (/detail/19/region)
- [x] 리전폼 두번째 폼 접근
- [x] 이로치 모드 토글 (쿼리 파라미터 유지)
- [x] 스위치 버튼 동작 확인
- [x] 이미지 슬라이더 formIndex 변경 시 URL 업데이트
- [x] 검색 결과에서 링크 정상 동작
- [x] 기존 쿼리 파라미터 URL 301 리다이렉트
- [x] moves 페이지에서 상세 정보 보러가기 링크 정상 동작
- [x] 리전폼 기술 페이지 접근 (/detail/19/moves/region)
- [x] 리전폼 기술 페이지 폼 전환 동작 확인
- [x] 리전폼 기술 페이지 버전 선택 동작 확인
- [x] 상세 페이지에서 "더 많은 기술 보기" 링크 정상 동작 (리전폼)
- [x] 기존 쿼리 파라미터 URL 리다이렉트 (/detail/19/moves?activeType=region → /detail/19/moves/region)
- [x] 기본폼 페이지 접근 (/detail/25/form/1)
- [x] 기본폼 기술 페이지 접근 (/detail/25/moves/form/1)
- [x] 기본폼 폼 전환 동작 확인
- [x] 기존 쿼리 파라미터 URL 리다이렉트 (/detail/25?activeIndex=1 → /detail/25/form/1)
- [x] 기존 쿼리 파라미터 URL 리다이렉트 (/detail/25/moves?activeIndex=1 → /detail/25/moves/form/1)
- [x] 사이트맵 메가/리전 URL 경로 기반으로 변경
- [x] 특성 도감 카드 링크 경로 기반으로 변경
- [x] 기술 도감 카드 링크 경로 기반으로 변경
- [x] 전체 코드에서 activeType/activeIndex 쿼리 파라미터 URL 사용 부분 확인 및 수정

## 📝 향후 작업

- ~~사이트맵 업데이트 검토 (메가진화/리전폼 URL 추가)~~ ✅ 완료
- Google Search Console에서 인덱싱 상태 모니터링

## 🚀 머지 정보

**머지 대상**: `feature/1.30.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- shinyMode는 쿼리 파라미터로 유지 (동일 콘텐츠의 다른 표현)
- 기존 URL이 검색엔진에 인덱싱되어 있을 수 있으므로 301 리다이렉트 필수
- 기본폼 URL(`/detail/{number}`)은 경로 변경 없음 - 리다이렉트 불필요
- Route Groups `(form)`을 사용하여 URL에는 영향 없이 파일 구조 정리
