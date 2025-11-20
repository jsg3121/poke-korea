import PokemonCardComponent from '~/components/pokemonCard/desktop/PokemonCard.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'

interface HomeBannerContainerProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const HomeBannerContainer = ({ dailyPokemon }: HomeBannerContainerProps) => {
  return (
    <section
      className="max-w-[1280px] w-full mx-auto mb-20"
      aria-labelledby="daily-pokemon-heading"
    >
      <h2
        id="daily-pokemon-heading"
        className="h-12 text-[2.5rem] font-bold text-primary-4 text-center"
      >
        오늘의 포켓몬
      </h2>
      <div
        className="px-8 w-full max-w-[1280px] h-[26rem] flex items-center gap-6 overflow-x-auto [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
        role="region"
        aria-label="오늘의 포켓몬 슬라이드"
      >
        {dailyPokemon.map((pokemon) => {
          return (
            <PokemonCardComponent
              key={`pokemon-id-${pokemon.id}`}
              pokemonData={pokemon}
            />
          )
        })}
      </div>
    </section>
  )
}

export default HomeBannerContainer
