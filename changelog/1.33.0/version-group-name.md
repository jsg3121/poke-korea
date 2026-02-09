# 버전 그룹명 baseVersionGroupName 적용 (version-group-name)

## 📋 작업 개요

**브랜치**: `feature/1.33.0-version-group-name`
**작업 유형**: 기능 개선
**작업 기간**: 2026-02-09
**담당**: Claude Code

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

| #   | 파일                                                                  | 변경 내용                                              |
| --- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | `src/gql/fragment.graphql`                                            | `baseVersionGroupId`, `baseVersionGroupName` 필드 추가 |
| 2   | `src/gql/query.graphql`                                               | `GetVersionGroups` 쿼리에 동일 필드 추가               |
| 3   | `src/graphql/schema.graphql`                                          | codegen 자동 재생성                                    |
| 4   | `src/graphql/gqlGenerated.ts`                                         | codegen 자동 재생성                                    |
| 5   | `src/graphql/typeGenerated.ts`                                        | codegen 자동 재생성                                    |
| 6   | `src/container/desktop/.../MovesHeader.container.tsx`                 | `nameKo` → `baseVersionGroupName` (3곳)                |
| 7   | `src/container/mobile/.../MovesHeader.container.tsx`                  | `nameKo` → `baseVersionGroupName` (3곳)                |
| 8   | `src/container/desktop/.../LevelLearnableSkill.component.tsx`         | `nameKo` → `baseVersionGroupName` (1곳)                |
| 9   | `src/container/desktop/.../MachineLearnableSkill.component.tsx`       | `nameKo` → `baseVersionGroupName` (1곳)                |
| 10  | `src/container/mobile/.../LevelLearnableSkill.component.tsx`          | `nameKo` → `baseVersionGroupName` (1곳)                |
| 11  | `src/container/mobile/.../MachineLearnableSkill.component.tsx`        | `nameKo` → `baseVersionGroupName` (1곳)                |
| 12  | `src/app/detail/[pokemonId]/moves/_metadata/generateMovesMetadata.ts` | `nameKo` → `baseVersionGroupName` (4곳)                |
| 13  | `src/app/detail/[pokemonId]/moves/form/[[...segments]]/page.tsx`      | `nameKo` → `baseVersionGroupName` (4곳)                |
| 14  | `src/app/detail/[pokemonId]/moves/region/[[...segments]]/page.tsx`    | `nameKo` → `baseVersionGroupName` (4곳)                |

### 변경하지 않은 부분

- **Context 파일**: `VersionGroup` 타입을 사용하므로 codegen 후 자동 반영
- **\_fetch 모듈**: GraphQL Document 호출만 하므로 쿼리 수정 + codegen으로 자동 반영
- **movesParams.module.ts**: `versionGroupId`만 사용하므로 변경 불필요
- **`skill.nameKo`**: 기술 이름이므로 변경 대상 아님

## ✅ 테스트 체크리스트

- [x] `npm run codegen` 성공
- [x] `npm run lint` 통과
- [x] `npm run build` 성공
- [ ] 기술 헤더 버전 버튼에 올바른 시리즈명 표시
- [ ] 최초/최신 등장 버전 라벨에 올바른 시리즈명 표시
- [ ] 상세 페이지 습득 기술 카드 버전 정보 정상 표시
- [ ] 기술 페이지 메타데이터에 올바른 시리즈명 포함

## 📝 향후 작업

- `feature/1.33.0`으로 머지

## 🚀 머지 정보

**머지 대상**: `feature/1.33.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- 백엔드 API에서 `baseVersionGroupName` 필드가 사전 배포되어 있어야 프론트 배포 가능
- `nameKo` 필드는 제거하지 않고 유지 (기존 참조가 있을 수 있음)
