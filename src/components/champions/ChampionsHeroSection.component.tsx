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
    <section className="w-full mb-8 desktop:mb-12">
      <ChampionsHomeSectionHeader
        title="가장 인기있는 포켓몬 TOP 3"
        description="가장 높은 사용률을 보여주는 포켓몬"
        moreHref={moreHref}
        moreLabel="티어 전체 보기"
      />
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
      <div className="hidden desktop:grid grid-cols-3 gap-6 max-w-[960px] mx-auto mt-8">
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
