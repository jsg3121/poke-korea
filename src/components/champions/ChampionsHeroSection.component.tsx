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

      {/* 반응형 단일 가로 스크롤 슬라이드. 가로 스크롤은 그리드처럼 셀 폭을
          밀어주는 힘이 없어 카드가 셸 하한(min-w-36=144px)에 머문다 →
          li에 w-48(192px, 셸 모바일 상한)을 줘 폭을 확보한다(일반 홈
          HorizontalScrollList 선례, [[ds-page-redesign-remaining]]). 데스크톱은
          셸 w-56이 목표라 li 폭을 풀어(desktop:w-auto) 셸 규격을 따르게 한다. */}
      <ul
        className="flex gap-4 overflow-x-auto py-1 -mx-2 px-2 desktop:py-4 [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl desktop:[&::-webkit-scrollbar-thumb]:bg-primary-3 desktop:[&::-webkit-scrollbar-track]:bg-primary-2"
        aria-label="S 티어 포켓몬 슬라이드"
      >
        {top3.map((pokemon) => (
          <li
            key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
            className="flex-shrink-0 w-48 desktop:w-auto"
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
