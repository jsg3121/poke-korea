import { PokemonInfoFragment, PokemonType } from '~/graphql/typeGenerated'
import TypeDetailBanner from '~/components/adSlot/TypeDetailBanner.component'
import TypeDetailChampions from '~/containers/typeEffectivenessDetail/TypeDetailChampions.container'
import TypeDetailCombo from '~/containers/typeEffectivenessDetail/TypeDetailCombo.container'
import TypeDetailFaq from '~/containers/typeEffectivenessDetail/TypeDetailFaq.container'
import TypeDetailMatchup from '~/containers/typeEffectivenessDetail/TypeDetailMatchup.container'
import TypeDetailNav from '~/containers/typeEffectivenessDetail/TypeDetailNav.container'
import TypeDetailPokemon from '~/containers/typeEffectivenessDetail/TypeDetailPokemon.container'
import TypeDetailSummary from '~/containers/typeEffectivenessDetail/TypeDetailSummary.container'
import { ChampionsTypeEntry } from '~/app/type-effectiveness/[type]/_fetch/typeDetail.fetch'

interface TypeEffectivenessDetailProps {
  pokemonType: PokemonType
  pokemons: Array<PokemonInfoFragment>
  pokemonTotalCount: number
  champions: Array<ChampionsTypeEntry>
}

const TypeEffectivenessDetail = ({
  pokemonType,
  pokemons,
  pokemonTotalCount,
  champions,
}: TypeEffectivenessDetailProps) => {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 pb-20 pt-6 desktop:pb-10 desktop:pt-8">
      <TypeDetailSummary pokemonType={pokemonType} />
      <TypeDetailMatchup pokemonType={pokemonType} />
      <TypeDetailBanner />
      <TypeDetailCombo pokemonType={pokemonType} />
      <TypeDetailPokemon
        pokemonType={pokemonType}
        pokemons={pokemons}
        totalCount={pokemonTotalCount}
      />
      <TypeDetailChampions pokemonType={pokemonType} entries={champions} />
      <TypeDetailFaq pokemonType={pokemonType} />
      <TypeDetailNav pokemonType={pokemonType} />
    </section>
  )
}

export default TypeEffectivenessDetail
