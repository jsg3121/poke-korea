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
import { initializeApollo } from '~/module/apolloClient'
import { TYPE_SHOWCASE_POKEMON } from '~/constants/typeShowcasePokemon'

/**
 * 타입 상세 페이지의 GraphQL 데이터 조회.
 *
 * 상성·문안은 정적 상수라 조회가 필요 없고, **포켓몬 6종과 챔피언스 티어만**
 * 서버에서 가져온다. 두 조회는 서로 독립이라 병렬로 돌린다.
 *
 * 조회가 실패해도 페이지 전체를 죽이지 않는다 — 상성 정보(이 페이지의 핵심)는
 * 정적 상수에서 나오므로, 부가 블록이 비더라도 검색 유입 사용자는 답을 얻는다.
 */

/** 노출할 챔피언스 티어 — S·A·B만. C·D는 대전 메타 상위라 보기 어렵다. */
const VISIBLE_TIERS = ['S', 'A', 'B'] as const

/** 두 포맷을 모두 노출한다(사용자 결정) — 포맷마다 상위 포켓몬이 다르다. */
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
  /** 인지도 상수 순서를 유지한 포켓몬 목록 */
  pokemons: Array<PokemonInfoFragment>
  /** 해당 타입 포켓몬 전체 수 — "83종 중 6종" 표기에 쓴다 */
  pokemonTotalCount: number
  /** 포맷별 최상위 티어 1종. 해당 티어가 없는 포맷은 항목 자체가 빠진다. */
  champions: Array<ChampionsTypeEntry>
}

/** 티어 문자열을 정렬 가능한 순위로. 낮을수록 상위. */
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

/**
 * 인지도 상수의 6종을 조회한다.
 *
 * 타입 필터로 한 번에 받아 상수 목록으로 거른다 — 6번 개별 조회하는 것보다
 * 왕복이 적다. **상수의 순서를 유지**하는 것이 중요하다(인지도 판단 순이라
 * 도감 번호 순으로 재정렬되면 의도가 사라진다).
 */
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

    // 상수 순서대로 뽑는다. 기본 폼만 쓰므로 number로 찾는다 — id로 찾으면
    // 메가·리전폼 행이 섞일 수 있다.
    const pokemons = showcase
      .map((entry) => byNumber.get(entry.id))
      .filter((pokemon): pokemon is PokemonInfoFragment => Boolean(pokemon))

    return { pokemons, totalCount: list.length }
  } catch {
    // 부가 블록이라 실패해도 페이지는 살린다.
    return { pokemons: [], totalCount: 0 }
  }
}

/**
 * 포맷별 S·A·B 티어 중 최상위 1종을 가져온다.
 *
 * `getChampionsMetaSummary`는 `tier` 필터를 지원하지만 **타입 필터는 없다**.
 * 따라서 티어별로 받아 타입으로 거른다. 티어 하나당 최대 수십 종이라 부담이
 * 크지 않다.
 *
 * 해당 타입에 S·A·B가 하나도 없는 포맷은 결과에서 빠진다 — 실제로 흔한
 * 경우다(독 타입은 BSS에 해당 티어가 없다).
 */
const fetchChampionsByType = async (
  apolloClient: ReturnType<typeof initializeApollo>,
  pokemonType: PokemonType,
): Promise<Array<ChampionsTypeEntry>> => {
  try {
    // 포맷당 1회만 조회한다. tier 필터로 티어별로 부르면 왕복이 6회가 되는데,
    // 실측상 6회 0.50초 vs 2회 0.37초로 한 번에 받아 거르는 편이 빠르다.
    // 응답에 C·D 티어가 섞여 오지만 아래에서 VISIBLE_TIERS로 걸러낸다.
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
          // 최상위 티어 우선, 같은 티어면 채택 순위가 앞선 쪽.
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
