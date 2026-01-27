# 메가진화 폼 버전 정보 버그 수정 (fix-mega-version-info)

## 작업 개요

**브랜치**: `feature/1.30.0-fix-mega-version-info`
**작업 유형**: 버그 수정
**작업 기간**: 2026-01-21
**담당**: Claude Code

## 작업 목표

메가진화 포켓몬 상세 페이지에서 습득 기술 정보의 버전 정보가 표시되지 않는 버그 수정

## 문제 상황

- 메가진화 포켓몬(예: 메가리자몽X, 메가리자몽Y 등) 상세 페이지에서 습득 기술의 버전 정보가 나오지 않음
- 원인: 메가진화 페이지에서 `versionGroup` 데이터를 조회하지 않고 `undefined`로 전달
- `Detail.context.tsx`의 `getVersionInfo()` 함수에서 `versionGroup?.find(...)`가 항상 `undefined` 반환

## 주요 변경사항

### 1. fetchMegaEvolutionData 함수 수정

**파일**: [src/app/detail/[pokemonId]/(form)/modules/fetchDetailData.ts](../../src/app/detail/[pokemonId]/(form)/modules/fetchDetailData.ts)

메가진화 데이터 조회 시 버전 그룹도 함께 조회하도록 수정

**변경 전**:
```typescript
export const fetchMegaEvolutionData = async (
  pokemonId: number,
): Promise<PokemonMegaEvolution[]> => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<GetPokemonMegaEvolutionQuery>({
    query: GetPokemonMegaEvolutionDocument,
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  return data?.getPokemonMegaEvolution ?? []
}
```

**변경 후**:
```typescript
export const fetchMegaEvolutionData = async (
  pokemonId: number,
): Promise<{
  megaEvolutionData: PokemonMegaEvolution[]
  versionGroupData: VersionGroup[]
}> => {
  const apolloClient = initializeApollo()

  const [{ data: megaData }, { data: versionGroup }] = await Promise.all([
    apolloClient.query<GetPokemonMegaEvolutionQuery>({
      query: GetPokemonMegaEvolutionDocument,
      variables: { pokemonId },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<GetVersionGroupsQuery>({
      query: GetVersionGroupsDocument,
      fetchPolicy: 'cache-first',
    }),
  ])

  return {
    megaEvolutionData: megaData?.getPokemonMegaEvolution ?? [],
    versionGroupData: versionGroup?.getVersionGroups ?? [],
  }
}
```

### 2. 메가진화 페이지에서 versionGroup 전달

**파일**: [src/app/detail/[pokemonId]/(form)/mega/[[...index]]/page.tsx](../../src/app/detail/[pokemonId]/(form)/mega/[[...index]]/page.tsx)

**변경 전**:
```typescript
const megaEvolutionData = await fetchMegaEvolutionData(parsedPokemonId)

const props = {
  // ...
  versionGroup: undefined,
  // ...
}
```

**변경 후**:
```typescript
const { megaEvolutionData, versionGroupData } =
  await fetchMegaEvolutionData(parsedPokemonId)

const props = {
  // ...
  versionGroup: versionGroupData.length > 0 ? versionGroupData : undefined,
  // ...
}
```

### 3. moves/form 페이지 버전 조회 수정 (추가 수정)

**파일**: [src/app/detail/[pokemonId]/moves/form/[[...index]]/page.tsx](../../src/app/detail/[pokemonId]/moves/form/[[...index]]/page.tsx)

버전 그룹 조회 시 `activeIndex`를 항상 `0`(일반 폼)으로 고정

## 테스트 체크리스트

- [ ] 메가리자몽X 상세 페이지에서 습득 기술 버전 정보 표시 확인
- [ ] 메가리자몽Y 상세 페이지에서 습득 기술 버전 정보 표시 확인
- [ ] 일반 리자몽 상세 페이지 정상 동작 확인
- [ ] 다른 메가진화 포켓몬(예: 메가이상해꽃, 메가거북왕 등) 동일 동작 확인
- [ ] 빌드 정상 완료 확인

## 머지 정보

**머지 대상**: `feature/1.30.0`
**머지 예정일**: TBD
**관련 PR**: TBD
