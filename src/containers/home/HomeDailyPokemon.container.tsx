import { PokemonCardFragment } from '~/graphql/typeGenerated'
import HorizontalScrollList from '~/components/horizontalScrollList/HorizontalScrollList.component'
import PokemonCard from '~/components/pokemonCard/PokemonCard.component'
import SectionHeading from '~/components/SectionHeading.component'

interface HomeDailyPokemonProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const HomeDailyPokemon = ({ dailyPokemon }: HomeDailyPokemonProps) => {
  if (dailyPokemon.length === 0) return null

  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="daily-pokemon-heading"
    >
      <SectionHeading id="daily-pokemon-heading">오늘의 포켓몬</SectionHeading>

      <HorizontalScrollList aria-label="오늘의 포켓몬 목록">
        {dailyPokemon.map((pokemon) => (
          <PokemonCard
            key={`pokemon-id-${pokemon.id}`}
            variant="pokedex"
            pokemonData={pokemon}
          />
        ))}
      </HorizontalScrollList>
    </section>
  )
}

export default HomeDailyPokemon
