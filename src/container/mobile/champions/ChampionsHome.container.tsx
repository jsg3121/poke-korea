import Link from 'next/link'
import ChampionsTopCardMobile from '~/components/champions/ChampionsTopCardMobile.component'
import PageHeader from '~/components/mobile/PageHeader'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
  return (
    <section className="w-full h-full mx-auto relative">
      <PageHeader
        title="포켓몬 챔피언스"
        description={`포켓몬 챔피언스 187종 도감, 티어 리스트, 메타 분석`}
      />
      <section
        className="w-[calc(100%-2.5rem)] mx-auto"
        aria-labelledby="top-pokemon-heading"
      >
        <h2
          id="top-pokemon-heading"
          className="h-10 text-[1.5rem] font-bold text-primary-4 text-center mb-4"
        >
          인기 포켓몬 Top 10
        </h2>

        {(['S', 'A', 'B', 'C', 'D'] as const).map((tier) => {
          const tierPokemons = topPokemons.filter((p) => p.tier === tier)
          if (tierPokemons.length === 0) return null
          return (
            <div key={tier} className="mb-8">
              <h3 className="text-[1.25rem] font-bold text-primary-4 mb-5 text-center">
                {tier} 티어
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tierPokemons.map((pokemon) => (
                  <ChampionsTopCardMobile
                    key={pokemon.pokemonId}
                    pokemonData={pokemon}
                    isHighPriority={tier === 'S'}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <nav className="w-[calc(100%-2.5rem)] mx-auto flex flex-col gap-3 mb-8">
        <Link
          href="/champions/pokedex"
          aria-label="포켓몬 도감 바로가기"
          className="block bg-primary-4 rounded-[1rem]"
        >
          <article className="rounded-[1rem] overflow-hidden">
            <header className="flex-items-gap-4 px-4 py-3 bg-primary-2">
              <span className="text-2xl">📖</span>
              <h2 className="text-lg text-primary-4 font-bold">포켓몬 도감</h2>
            </header>
            <div className="p-4">
              <p className="text-sm text-primary-1 mb-2">
                챔피언스에 등장하는 187종 포켓몬
              </p>
              <span className="text-blue-600 text-sm font-medium">
                도감 보기 <span aria-hidden="true">→</span>
              </span>
            </div>
          </article>
        </Link>
        <Link
          href="/champions/tier"
          aria-label="티어 리스트 바로가기"
          className="block bg-primary-4 rounded-[1rem]"
        >
          <article className="rounded-[1rem] overflow-hidden">
            <header className="flex-items-gap-4 px-4 py-3 bg-primary-2">
              <span className="text-2xl">🏆</span>
              <h2 className="text-lg text-primary-4 font-bold">티어 리스트</h2>
            </header>
            <div className="p-4">
              <p className="text-sm text-primary-1 mb-2">
                사용률 기반 티어 순위표
              </p>
              <span className="text-blue-600 text-sm font-medium">
                티어 보기 <span aria-hidden="true">→</span>
              </span>
            </div>
          </article>
        </Link>
      </nav>

      <FooterContainer />
    </section>
  )
}

export default ChampionsHomeContainer
