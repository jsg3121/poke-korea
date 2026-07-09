import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonGigantamaxDocument,
  GetPokemonMegaEvolutionDocument,
  GetPokemonNormalFormDocument,
  GetPokemonNormalFormImageListDocument,
  GetPokemonRegionFormDocument,
  GetVersionGroupsDocument,
  PokemonDetailDocument,
} from '~/graphql/gqlGenerated'
import {
  GetDetailMovesPokemonInfoQuery,
  GetPokemonGigantamaxQuery,
  GetPokemonMegaEvolutionQuery,
  GetPokemonNormalFormImageListQuery,
  GetPokemonNormalFormImageListQueryVariables,
  GetPokemonNormalFormQuery,
  GetPokemonNormalFormQueryVariables,
  GetPokemonRegionFormQuery,
  GetVersionGroupsQuery,
  PokemonDetail,
  PokemonDetailQuery,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  VersionGroup,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { TActiveType } from '~/types/detailContext.type'

export interface DetailPokemonInfo {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
  megaEvolutionData: Array<PokemonMegaEvolution>
  regionFormData: Array<PokemonRegionForm>
  isShinyInfo: boolean
  versionGroup?: Array<VersionGroup>
  normalFormImageList: Array<string>
  activeType: TActiveType
  activeIndex: number
}

export interface AdjacentPokemonInfo {
  number: number
  name: string
}

/**
 * 이전/다음 포켓몬(도감번호 ±1) 이름 조회 — 종 단위 내비게이션용(UX-005 M2).
 * 경량 쿼리(GetDetailMovesPokemonInfo: id·name·types만)를 재사용한다.
 * 도감 범위 밖(0번, 마지막 번호 다음)은 조회 실패 → null로 해당 방향 비활성.
 */
export const fetchAdjacentPokemon = async (
  pokemonId: number,
): Promise<{
  prev: AdjacentPokemonInfo | null
  next: AdjacentPokemonInfo | null
}> => {
  const apolloClient = initializeApollo()

  const fetchOne = async (id: number): Promise<AdjacentPokemonInfo | null> => {
    if (id < 1) return null
    try {
      const { data } = await apolloClient.query<GetDetailMovesPokemonInfoQuery>(
        {
          query: GetDetailMovesPokemonInfoDocument,
          variables: { pokemonId: id },
          fetchPolicy: 'cache-first',
        },
      )
      const name = data?.getPokemonDetail?.name
      return name ? { number: id, name } : null
    } catch {
      return null
    }
  }

  const [prev, next] = await Promise.all([
    fetchOne(pokemonId - 1),
    fetchOne(pokemonId + 1),
  ])

  return { prev, next }
}

/**
 * 기본 포켓몬 상세 정보 조회
 */
export const fetchPokemonDetail = async (
  pokemonId: number,
): Promise<PokemonDetail | null> => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<PokemonDetailQuery>({
    query: PokemonDetailDocument,
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  return data.getPokemonDetail ?? null
}

/**
 * 기본폼 데이터 페칭
 */
export const fetchNormalFormData = async (
  pokemonId: number,
  activeIndex: number,
): Promise<{
  normalFormData: PokemonNormalForm[]
  versionGroupData: VersionGroup[]
  normalFormImageList: string[]
}> => {
  const apolloClient = initializeApollo()

  const [{ data: normalForm }, { data: versionGroup }, { data: imageList }] =
    await Promise.all([
      apolloClient.query<
        GetPokemonNormalFormQuery,
        GetPokemonNormalFormQueryVariables
      >({
        query: GetPokemonNormalFormDocument,
        variables: {
          pokemonId,
          activeIndex,
        },
        fetchPolicy: 'cache-first',
      }),
      apolloClient.query<GetVersionGroupsQuery>({
        query: GetVersionGroupsDocument,
        fetchPolicy: 'cache-first',
      }),
      apolloClient.query<
        GetPokemonNormalFormImageListQuery,
        GetPokemonNormalFormImageListQueryVariables
      >({
        query: GetPokemonNormalFormImageListDocument,
        variables: {
          pokemonId,
        },
        fetchPolicy: 'cache-first',
      }),
    ])

  return {
    normalFormData: normalForm?.getPokemonNormalForm ?? [],
    versionGroupData: versionGroup?.getVersionGroups ?? [],
    normalFormImageList: imageList?.getPokemonNormalFormImageList ?? [],
  }
}

/**
 * 메가진화 데이터 페칭
 */
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

/**
 * 리전폼 데이터 페칭
 */
export const fetchRegionFormData = async (
  pokemonId: number,
): Promise<{
  regionFormData: PokemonRegionForm[]
  versionGroupData: VersionGroup[]
}> => {
  const apolloClient = initializeApollo()

  const [{ data: regionData }, { data: versionGroup }] = await Promise.all([
    apolloClient.query<GetPokemonRegionFormQuery>({
      query: GetPokemonRegionFormDocument,
      variables: { pokemonId },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<GetVersionGroupsQuery>({
      query: GetVersionGroupsDocument,
      fetchPolicy: 'cache-first',
    }),
  ])

  return {
    regionFormData: regionData?.getPokemonRegionForm ?? [],
    versionGroupData: versionGroup?.getVersionGroups ?? [],
  }
}

/**
 * 거다이맥스 데이터 페칭
 */
export const fetchGigantamaxData = async (
  pokemonId: number,
): Promise<{
  gigantamaxData: PokemonGigantamax[]
}> => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<GetPokemonGigantamaxQuery>({
    query: GetPokemonGigantamaxDocument,
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  return {
    gigantamaxData: data?.getPokemonGigantamaxByPokemonId ?? [],
  }
}
