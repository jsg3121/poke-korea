import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ChampionsTopCard from '~/components/common/ChampionsTopCard.component'
import HorizontalScrollList from '~/components/horizontalScrollList/HorizontalScrollList.component'

import ChampionsHomeSectionHeader from './ChampionsHomeSectionHeader.component'

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
        description="가장 많이 채택되는 포켓몬"
        moreHref={moreHref}
        moreLabel="티어 전체 보기"
      />

      <HorizontalScrollList aria-label="S 티어 포켓몬 슬라이드">
        {top3.map((pokemon) => (
          <ChampionsTopCard
            key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
            pokemonData={pokemon}
            isHighPriority
            formatSlug={formatSlug}
          />
        ))}
      </HorizontalScrollList>
    </section>
  )
}

export default ChampionsHeroSection
