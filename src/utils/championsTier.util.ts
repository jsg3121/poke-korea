import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

export const TOP_CHAMPIONS_TIERS = ['S', 'A'] as const

export type TopChampionsTier = (typeof TOP_CHAMPIONS_TIERS)[number]

export interface ChampionsTierGroup {
  tier: TopChampionsTier
  pokemons: ChampionsMetaSummaryFragment[]
}

export const groupChampionsByTier = (
  pokemons: ChampionsMetaSummaryFragment[],
  tiers: readonly TopChampionsTier[] = TOP_CHAMPIONS_TIERS,
): ChampionsTierGroup[] =>
  tiers
    .map((tier) => ({
      tier,
      pokemons: pokemons.filter((p) => p.tier === tier),
    }))
    .filter((group) => group.pokemons.length > 0)
