import {
  GetPokemonMegaEvolutionDocument,
  GetPokemonNormalFormDocument,
  GetPokemonNormalFormImageListDocument,
  GetPokemonRegionFormDocument,
  GetVersionGroupsDocument,
  PokemonDetailDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonMegaEvolutionQuery,
  GetPokemonNormalFormImageListQuery,
  GetPokemonNormalFormImageListQueryVariables,
  GetPokemonNormalFormQuery,
  GetPokemonNormalFormQueryVariables,
  GetPokemonRegionFormQuery,
  GetVersionGroupsQuery,
  PokemonDetail,
  PokemonDetailQuery,
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
): Promise<PokemonMegaEvolution[]> => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<GetPokemonMegaEvolutionQuery>({
    query: GetPokemonMegaEvolutionDocument,
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  return data?.getPokemonMegaEvolution ?? []
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
