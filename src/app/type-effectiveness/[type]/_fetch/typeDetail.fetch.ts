import { TYPE_SHOWCASE_POKEMON } from '~/constants/typeShowcasePokemon'
import {
  GetChampionsMetaSummaryByFilterDocument,
  GetPokemonListDocument,
} from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  ChampionsMetaSummaryFragment,
  GetChampionsMetaSummaryByFilterQuery,
  GetChampionsMetaSummaryByFilterQueryVariables,
  GetPokemonListQuery,
  GetPokemonListQueryVariables,
  PokemonInfoFragment,
  PokemonType,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/modules/apolloClient.module'

const VISIBLE_TIERS = ['S', 'A', 'B'] as const

const CHAMPIONS_FORMATS: ReadonlyArray<{
  format: ChampionsFormat
  label: string
  slug: 'double' | 'single'
}> = [
  {
    format: ChampionsFormat.VGC_DOUBLES,
    label: 'VGC 더블',
    slug: 'double',
  },
  {
    format: ChampionsFormat.BSS_SINGLES,
    label: 'BSS 싱글',
    slug: 'single',
  },
]

export interface ChampionsTypeEntry {
  formatLabel: string
  formatSlug: 'double' | 'single'
  pokemon: ChampionsMetaSummaryFragment
}

export interface TypeDetailData {
  pokemons: Array<PokemonInfoFragment>
  pokemonTotalCount: number
  champions: Array<ChampionsTypeEntry>
}

const tierRank = (tier: string | null | undefined): number => {
  const index = VISIBLE_TIERS.indexOf(tier as (typeof VISIBLE_TIERS)[number])
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

export const fetchTypeDetailData = async (
  pokemonType: PokemonType,
): Promise<TypeDetailData> => {
  const apolloClient = initializeApollo()
  const showcase = TYPE_SHOWCASE_POKEMON[pokemonType] ?? []

  const [showcaseResult, champions] = await Promise.all([
    fetchShowcasePokemons(apolloClient, pokemonType, showcase),
    fetchChampionsByType(apolloClient, pokemonType),
  ])

  return {
    pokemons: showcaseResult.pokemons,
    pokemonTotalCount: showcaseResult.totalCount,
    champions,
  }
}

const fetchShowcasePokemons = async (
  apolloClient: ReturnType<typeof initializeApollo>,
  pokemonType: PokemonType,
  showcase: ReadonlyArray<{ id: number; name: string }>,
): Promise<{ pokemons: Array<PokemonInfoFragment>; totalCount: number }> => {
  if (showcase.length === 0) return { pokemons: [], totalCount: 0 }

  try {
    const { data } = await apolloClient.query<
      GetPokemonListQuery,
      GetPokemonListQueryVariables
    >({
      query: GetPokemonListDocument,
      variables: { filter: { types: [pokemonType] } },
      fetchPolicy: 'network-only',
    })

    const list = data?.getPokemonList ?? []
    const byNumber = new Map(list.map((pokemon) => [pokemon.number, pokemon]))

    const pokemons = showcase
      .map((entry) => byNumber.get(entry.id))
      .filter((pokemon): pokemon is PokemonInfoFragment => Boolean(pokemon))

    return { pokemons, totalCount: list.length }
  } catch {
    return { pokemons: [], totalCount: 0 }
  }
}

const fetchChampionsByType = async (
  apolloClient: ReturnType<typeof initializeApollo>,
  pokemonType: PokemonType,
): Promise<Array<ChampionsTypeEntry>> => {
  try {
    const results = await Promise.all(
      CHAMPIONS_FORMATS.map(async ({ format, label, slug }) => {
        const { data } = await apolloClient.query<
          GetChampionsMetaSummaryByFilterQuery,
          GetChampionsMetaSummaryByFilterQueryVariables
        >({
          query: GetChampionsMetaSummaryByFilterDocument,
          variables: { filter: { format } },
          fetchPolicy: 'network-only',
        })

        const candidates = (data?.getChampionsMetaSummary ?? [])
          .filter(
            (entry) =>
              entry.types?.includes(pokemonType) &&
              tierRank(entry.tier) !== Number.MAX_SAFE_INTEGER,
          )
          .sort((a, b) => {
            const diff = tierRank(a.tier) - tierRank(b.tier)
            if (diff !== 0) return diff
            return (
              (a.usageRank ?? Number.MAX_SAFE_INTEGER) -
              (b.usageRank ?? Number.MAX_SAFE_INTEGER)
            )
          })

        const top = candidates[0]
        if (!top) return undefined

        return { formatLabel: label, formatSlug: slug, pokemon: top }
      }),
    )

    return results.filter((entry): entry is ChampionsTypeEntry =>
      Boolean(entry),
    )
  } catch {
    return []
  }
}
