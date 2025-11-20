import PokemonCardComponent from '~/components/pokemonCard/mobile/PokemonCard.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'

interface HomeBannerContainerProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const HomeBannerContainer = ({ dailyPokemon }: HomeBannerContainerProps) => {
  return (
    <section
      className="w-[calc(100%-2.5rem)] mx-auto mb-20 px-2 relative overflow-x-auto [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
      aria-labelledby="daily-pokemon-heading"
    >
      <h2
        id="daily-pokemon-heading"
        className="h-12 text-[2rem] font-bold text-primary-4 text-center sticky top-5 left-0 mb-4"
      >
        오늘의 포켓몬
      </h2>
      <div
        className="w-[900px] h-[24rem] grid grid-cols-5 gap-4 items-center"
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
