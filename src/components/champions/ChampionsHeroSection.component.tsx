import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import ChampionsHomeSectionHeader from './ChampionsHomeSectionHeader.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHeroSectionProps {
  sTierPokemons: ChampionsMetaSummaryFragment[]
  moreHref: string
}

const ChampionsHeroSection = ({
  sTierPokemons,
  moreHref,
}: ChampionsHeroSectionProps) => {
  if (sTierPokemons.length === 0) {
    return null
  }

  const top3 = sTierPokemons.slice(0, 3)

  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full mb-8 desktop:mb-12"
    >
      <div id="hero-heading">
        <ChampionsHomeSectionHeader
          title="S 티어 — 메타 최상위"
          description="현재 메타에서 가장 강력한 포켓몬"
          moreHref={moreHref}
          moreLabel="티어 전체 보기"
        />
      </div>

      {/* 모바일: 가로 스크롤 / 데스크탑: 3열 그리드 */}
      <div className="block desktop:hidden">
        <ul
          className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-3 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-2 [&::-webkit-scrollbar-track]:rounded-xl"
          role="region"
          aria-label="S 티어 포켓몬 슬라이드"
        >
          {top3.map((pokemon) => (
            <li
              key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
              className="w-[200px] flex-shrink-0"
            >
              <ChampionsTopCard pokemonData={pokemon} isHighPriority />
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden desktop:grid grid-cols-3 gap-6 max-w-[960px] mx-auto">
        {top3.map((pokemon) => (
          <ChampionsTopCard
            key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
            pokemonData={pokemon}
            isHighPriority
          />
        ))}
      </div>
    </section>
  )
}

export default ChampionsHeroSection
