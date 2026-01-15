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
/detail/6?activeType=mega
/detail/6?activeType=mega&activeIndex=1
/detail/19?activeType=region
```

### 변경 후 URL 패턴

```
/detail/6/mega
/detail/6/mega/1
/detail/19/region
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
│   ├── [[...form]]/
│   │   └── page.tsx    # 기본폼 + mega/region + formIndex 통합 처리
│   ├── moves/
│   │   └── page.tsx
│   └── opengraph-image.tsx
```

- `[[...form]]` Optional Catch-all Segment 사용
- `/detail/6`, `/detail/6/mega`, `/detail/6/mega/1` 모두 단일 페이지에서 처리

### 2. 쿼리 최적화

activeType별 필요한 데이터만 페칭하도록 최적화:

| activeType | 페칭 데이터                                     |
| ---------- | ----------------------------------------------- |
| normal     | normalForm + versionGroup + normalFormImageList |
| mega       | megaEvolution 데이터만                          |
| region     | regionForm + versionGroup                       |

### 3. URL 파라미터 처리 방식 변경

- `activeType`, `activeIndex` 쿼리 파라미터 → Path 세그먼트로 변경
- `shinyMode`는 동일 콘텐츠의 다른 표현이므로 쿼리 파라미터 유지

### 4. 컴포넌트 수정

- **Detail.context.tsx**: 서버에서 `activeType`, `activeIndex` props로 전달받아 처리
- **스위치 컴포넌트**: Context에서 값을 가져와 Path 기반 URL 생성
- **검색 결과 링크**: Path 기반 URL 생성 로직 변경
- **이미지 슬라이더**: 슬라이드 변경 시 Path 기반 URL로 업데이트

### 5. 301 리다이렉트 설정

기존 쿼리 파라미터 URL → 새 Path URL로 영구 리다이렉트 (next.config.js)

```javascript
// 예시
/detail/6?activeType=mega → /detail/6/mega
/detail/6?activeType=mega&activeIndex=1 → /detail/6/mega/1
/detail/19?activeType=region → /detail/19/region
```

## 📊 SEO 개선 효과

| 항목            | 개선 내용                           |
| --------------- | ----------------------------------- |
| 크롤링 우선순위 | 독립적인 페이지로 인식              |
| 인덱싱 확실성   | 쿼리 파라미터 무시 가능성 제거      |
| URL 가독성      | 직관적인 URL 구조                   |
| 키워드 노출     | URL에 mega, region 키워드 직접 노출 |

## 🔧 기술적 세부사항

### 수정 파일 목록

| 파일                                                                                          | 변경 내용                            |
| --------------------------------------------------------------------------------------------- | ------------------------------------ |
| `src/app/detail/[pokemonId]/[[...form]]/page.tsx`                                             | 신규 - 통합 상세 페이지              |
| `src/app/detail/[pokemonId]/page.tsx`                                                         | 삭제                                 |
| `src/context/Detail.context.tsx`                                                              | activeType, activeIndex props 추가   |
| `src/container/desktop/header/header.search/**/ResultListData.tsx`                            | Path URL 생성                        |
| `src/container/mobile/header/header.search/**/ResultListData.tsx`                             | Path URL 생성                        |
| `src/container/desktop/detail/detail.summary/components/MegaSwitch.component.tsx`             | Path href 생성                       |
| `src/container/desktop/detail/detail.summary/components/RegionSwitch.component.tsx`           | Path href 생성                       |
| `src/container/desktop/detail/detail.summary/components/ShinySwitch.component.tsx`            | Path href 생성                       |
| `src/container/mobile/detail/detail.summary/components/MegaSwitch.component.tsx`              | Path href 생성                       |
| `src/container/mobile/detail/detail.summary/components/RegionSwitch.component.tsx`            | Path href 생성                       |
| `src/container/mobile/detail/detail.summary/components/ShinySwitch.component.tsx`             | Path href 생성                       |
| `src/container/desktop/detail/detail.summary/summary.pokemonImage/PokemonImage.compoment.tsx` | Path URL 업데이트                    |
| `src/container/mobile/detail/detail.summary/summary.pokemonImage/PokemonImage.compoment.tsx`  | Path URL 업데이트                    |
| `src/module/generateDetailSeoMetaData.ts`                                                     | 캐노니컬 URL Path 기반 생성          |
| `next.config.js`                                                                              | 301 리다이렉트 규칙 + 캐시 헤더 추가 |

## ✅ 테스트 체크리스트

- [x] 빌드 성공 확인
- [ ] 기본 포켓몬 상세 페이지 접근 (/detail/6)
- [ ] 메가진화 페이지 접근 (/detail/6/mega)
- [ ] 메가진화 두번째 폼 접근 (/detail/6/mega/1)
- [ ] 리전폼 페이지 접근 (/detail/19/region)
- [ ] 리전폼 두번째 폼 접근
- [ ] 이로치 모드 토글 (쿼리 파라미터 유지)
- [ ] 스위치 버튼 동작 확인
- [ ] 이미지 슬라이더 formIndex 변경 시 URL 업데이트
- [ ] 검색 결과에서 링크 정상 동작
- [ ] 기존 쿼리 파라미터 URL 301 리다이렉트

## 📝 향후 작업

- 사이트맵 업데이트 검토 (메가진화/리전폼 URL 추가)
- Google Search Console에서 인덱싱 상태 모니터링

## 🚀 머지 정보

**머지 대상**: `feature/1.30.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- shinyMode는 쿼리 파라미터로 유지 (동일 콘텐츠의 다른 표현)
- 기존 URL이 검색엔진에 인덱싱되어 있을 수 있으므로 301 리다이렉트 필수
- 기본폼 URL(`/detail/{number}`)은 경로 변경 없음 - 리다이렉트 불필요
