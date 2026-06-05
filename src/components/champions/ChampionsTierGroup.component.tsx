'use client'

import { useState } from 'react'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ChampionsTierBadge from './ChampionsTierBadge.component'
import ChampionsTierPokemonItem from './ChampionsTierPokemonItem.component'

type Tier = 'S' | 'A' | 'B' | 'C' | 'D'

interface ChampionsTierGroupProps {
  tier: Tier
  pokemons: ChampionsMetaSummaryFragment[]
  formatSlug: ChampionsFormatSlug
  /**
   * 초기 접힘 여부. C/D 티어처럼 항목이 많은 그룹은 기본 접힘으로 처리하여
   * 이미지 다수 동시 로드를 방지한다.
   */
  defaultCollapsed?: boolean
}

const ChampionsTierGroup = ({
  tier,
  pokemons,
  formatSlug,
  defaultCollapsed = false,
}: ChampionsTierGroupProps) => {
  const [isOpen, setIsOpen] = useState(!defaultCollapsed)
  const isEmpty = pokemons.length === 0
  const isHighPriorityTier = tier === 'S' || tier === 'A'

  const sortedPokemons = [...pokemons].sort(
    (a, b) => (b.usageRate ?? 0) - (a.usageRate ?? 0),
  )

  const headerContent = (
    <span className="flex items-center justify-between gap-2 px-4 py-2 bg-primary-4 border-b border-primary-3/50">
      <span className="flex items-center gap-2">
        <ChampionsTierBadge tier={tier} />
        <span className="text-base text-primary-1">{pokemons.length}종</span>
      </span>
      {defaultCollapsed && (
        <span
          className="text-sm text-primary-1 font-semibold"
          aria-hidden="true"
        >
          {isOpen ? '접기 ▲' : '펼치기 ▼'}
        </span>
      )}
    </span>
  )

  return (
    <div
      id={`tier-${tier}`}
      className="border border-primary-3/50 rounded-xl overflow-hidden scroll-mt-24"
    >
      {defaultCollapsed ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={`tier-group-${tier}-content`}
          className="w-full text-left"
        >
          {headerContent}
        </button>
      ) : (
        headerContent
      )}

      {isOpen && (
        <div
          id={`tier-group-${tier}-content`}
          className="py-4 px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2"
        >
          {isEmpty ? (
            <p className="col-span-full w-full text-center text-primary-3 py-8">
              해당 티어에 포켓몬이 없습니다
            </p>
          ) : (
            sortedPokemons.map((pokemon) => (
              <ChampionsTierPokemonItem
                key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
                pokemon={pokemon}
                isHighPriority={isHighPriorityTier}
                formatSlug={formatSlug}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ChampionsTierGroup
