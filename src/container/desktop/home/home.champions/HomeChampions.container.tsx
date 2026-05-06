import Link from 'next/link'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface HomeChampionsContainerProps {
  topPokemons: Array<ChampionsMetaSummaryFragment>
}

const HomeChampionsContainer = ({
  topPokemons,
}: HomeChampionsContainerProps) => {
  if (topPokemons.length === 0) return null

  return (
    <section
      className="max-w-[1280px] w-full mx-auto mb-10 mt-8 px-8"
      aria-labelledby="home-champions-heading"
    >
      <h2
        id="home-champions-heading"
        className="h-12 text-[2.5rem] font-bold text-primary-4 text-center"
      >
        인기 챔피언스 포켓몬
      </h2>
      <ul className="grid grid-cols-3 gap-6 mt-6">
        {topPokemons.map((pokemon) => (
          <li key={pokemon.pokemonId}>
            <ChampionsTopCard pokemonData={pokemon} isHighPriority />
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <Link
          href="/champions/list"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary-1 px-6 py-3 text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-colors hover:bg-primary-2 focus-visible:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
        >
          <span>챔피언스 전체 도감 보기</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default HomeChampionsContainer
