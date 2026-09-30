import { TActiveType } from '~/types/detailContext.type'
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
import { initializeApollo } from '~/modules/apolloClient.module'

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

const fetchPokemonSummary = async (
  id: number,
): Promise<AdjacentPokemonInfo | null> => {
  if (id < 1) return null
  const apolloClient = initializeApollo()
  try {
    const { data } = await apolloClient.query<GetDetailMovesPokemonInfoQuery>({
      query: GetDetailMovesPokemonInfoDocument,
      variables: { pokemonId: id },
      fetchPolicy: 'cache-first',
    })
    const name = data?.getPokemonDetail?.name
    return name ? { number: id, name } : null
  } catch {
    return null
  }
}

export const fetchPokemonSummaries = async (
  ids: Array<number>,
): Promise<Array<AdjacentPokemonInfo>> => {
  const results = await Promise.all(ids.map(fetchPokemonSummary))
  return results.filter((item): item is AdjacentPokemonInfo => item !== null)
}

export const fetchAdjacentPokemon = async (
  pokemonId: number,
): Promise<{
  prev: AdjacentPokemonInfo | null
  next: AdjacentPokemonInfo | null
}> => {
  const fetchOne = fetchPokemonSummary

  const [prev, next] = await Promise.all([
    fetchOne(pokemonId - 1),
    fetchOne(pokemonId + 1),
  ])

  return { prev, next }
}

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
