import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import ChampionsHomeSectionHeader from './ChampionsHomeSectionHeader.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsHeroSectionProps {
  sTierPokemons: ChampionsMetaSummaryFragment[]
  moreHref: string
  formatSlug: ChampionsFormatSlug
}

const ChampionsHeroSection = ({
  sTierPokemons,
  moreHref,
  formatSlug,
}: ChampionsHeroSectionProps) => {
  if (sTierPokemons.length === 0) {
    return null
  }

  const top3 = sTierPokemons.slice(0, 3)

  return (
    <section className="w-full mb-8 desktop:mb-12">
      <ChampionsHomeSectionHeader
        title="가장 인기있는 포켓몬 TOP 3"
        description="가장 높은 사용률을 보여주는 포켓몬"
        moreHref={moreHref}
        moreLabel="티어 전체 보기"
      />

      {/* 반응형 단일 가로 스크롤 슬라이드. 카드 규격은 도감 카드와 동일한
          PokemonCardShell(POKEMON_CARD_SIZE)을 따르므로 li에 고정폭을 주지 않고
          flex-shrink-0으로 슬라이드 축소만 막는다(UX-E1, 이중 DOM 통합). */}
      <ul
        className="flex gap-4 overflow-x-auto py-1 -mx-2 px-2 desktop:py-4 [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl desktop:[&::-webkit-scrollbar-thumb]:bg-primary-3 desktop:[&::-webkit-scrollbar-track]:bg-primary-2"
        aria-label="S 티어 포켓몬 슬라이드"
      >
        {top3.map((pokemon) => (
          <li
            key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
            className="flex-shrink-0"
          >
            <ChampionsTopCard
              pokemonData={pokemon}
              isHighPriority
              formatSlug={formatSlug}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ChampionsHeroSection
