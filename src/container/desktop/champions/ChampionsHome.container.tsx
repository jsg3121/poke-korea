import Link from 'next/link'
import PageHeader from '~/components/PageHeader'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ChampionsTopCard from '~/components/champions/ChampionsTopCard.component'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeContainerProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeContainer = ({
  topPokemons,
}: ChampionsHomeContainerProps) => {
  return (
    <section className="w-full max-w-[1280px] h-fit mx-auto pb-8 relative">
      <PageHeader
        title="포켓몬 챔피언스"
        description="포켓몬 챔피언스 187종 도감, 티어 리스트, 메타 분석"
      />
      <DesktopListTopBanner />

      <section aria-labelledby="top-pokemon-heading" className="mb-12">
        <h2
          id="top-pokemon-heading"
          className="h-12 text-[2rem] font-bold text-primary-4 text-center mb-6"
        >
          인기 포켓몬
        </h2>

        {(['S', 'A', 'B', 'C', 'D'] as const).map((tier) => {
          const tierPokemons = topPokemons.filter((p) => p.tier === tier)
          if (tierPokemons.length === 0) return null
          return (
            <div key={tier} className="mb-10">
              <h3 className="text-[1.75rem] font-bold text-primary-4 mb-4 text-center">
                {tier} 티어
              </h3>
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${tierPokemons.length}, 1fr)`,
                  maxWidth:
                    tierPokemons.length < 6
                      ? `${tierPokemons.length * 200}px`
                      : '100%',
                  margin: tierPokemons.length < 6 ? '0 auto' : undefined,
                }}
              >
                {tierPokemons.map((pokemon, index) => (
                  <ChampionsTopCard
                    key={pokemon.pokemonId}
                    pokemonData={pokemon}
                    isHighPriority={index < 3}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <nav className="grid grid-cols-2 gap-6 mb-12">
        <Link
          href="/champions/pokedex"
          aria-label="포켓몬 도감 바로가기"
          className="group block bg-primary-4 rounded-[1rem] hover:scale-105 transition-[transform] duration-[0.15s]"
        >
          <article className="rounded-[1rem] overflow-hidden">
            <header className="flex-items-gap-4 px-6 py-4 bg-primary-2 group-hover:bg-primary-3 transition-[background] duration-[0.15s]">
              <span className="text-[2rem]">📖</span>
              <h2 className="text-2xl text-primary-4 font-bold group-hover:text-primary-1 transition-[color] duration-[0.15s]">
                챔피언스 포켓몬
              </h2>
            </header>
            <div className="p-6">
              <p className="text-primary-1 mb-4">
                챔피언스에 등장하는 187종 포켓몬의 스탯, 타입, 메타 정보를
                확인하세요.
              </p>
              <p className="flex-between text-sm text-primary-2">
                총 187종 포켓몬
                <span className="text-blue-600 text-sm font-medium">
                  도감 보기 <span aria-hidden="true">→</span>
                </span>
              </p>
            </div>
          </article>
        </Link>
        <Link
          href="/champions/tier"
          aria-label="티어 리스트 바로가기"
          className="group block bg-primary-4 rounded-[1rem] hover:scale-105 transition-[transform] duration-[0.15s]"
        >
          <article className="rounded-[1rem] overflow-hidden">
            <header className="flex-items-gap-4 px-6 py-4 bg-primary-2 group-hover:bg-primary-3 transition-[background] duration-[0.15s]">
              <span className="text-[2rem]">🏆</span>
              <h2 className="text-2xl text-primary-4 font-bold group-hover:text-primary-1 transition-[color] duration-[0.15s]">
                티어 리스트
              </h2>
            </header>
            <div className="p-6">
              <p className="text-primary-1 mb-4">
                사용률 기반 티어 순위표를 확인하고 메타를 파악하세요.
              </p>
              <p className="flex-between text-sm text-primary-2">
                S, A, B, C, D 티어
                <span className="text-blue-600 text-sm font-medium">
                  티어 보기 <span aria-hidden="true">→</span>
                </span>
              </p>
            </div>
          </article>
        </Link>
      </nav>

      <FooterContainer />
    </section>
  )
}

export default ChampionsHomeContainer
