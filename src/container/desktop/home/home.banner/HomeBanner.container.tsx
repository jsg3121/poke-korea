import { PokemonCardFragment } from '~/graphql/typeGenerated'

interface HomeBannerContainerProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const HomeBannerContainer = ({ dailyPokemon }: HomeBannerContainerProps) => {
  return (
    <section
      className="max-w-7xl mx-auto mb-20"
      aria-labelledby="daily-pokemon-heading"
    >
      <h2 id="daily-pokemon-heading" className="sr-only">
        오늘의 랜덤 포켓몬
      </h2>
      <div
        className="px-4 w-full max-w-[1280px] h-96"
        role="region"
        aria-label="오늘의 랜덤 포켓몬 슬라이드"
      ></div>
    </section>
  )
}

export default HomeBannerContainer
