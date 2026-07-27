import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
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

      {/* 일반 홈과 동일한 DS 가로 스크롤(HorizontalScrollList) 사용 — 카드 폭·간격·
          엣지 페이드 규격을 공유해 메인 홈 카드와 통일한다. 자체 마크업을 쓰면 DS
          카드 폭 변경이 반영되지 않아 홈과 어긋난다(사용자 피드백 2026-07-27). */}
      <HorizontalScrollListComponent aria-label="S 티어 포켓몬 슬라이드">
        {top3.map((pokemon) => (
          <ChampionsTopCard
            key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
            pokemonData={pokemon}
            isHighPriority
            formatSlug={formatSlug}
          />
        ))}
      </HorizontalScrollListComponent>
    </section>
  )
}

export default ChampionsHeroSection
