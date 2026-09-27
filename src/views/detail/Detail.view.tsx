import DetailBottomBanner from '~/components/adSlot/DetailBottomBanner.component'
import DetailSkillsBanner from '~/components/adSlot/DetailSkillsBanner.component'
import DetailStatsBanner from '~/components/adSlot/DetailStatsBanner.component'
import DetailEvolution from '~/containers/detail/DetailEvolution.container'
import DetailExclusiveMoves from '~/containers/detail/DetailExclusiveMoves.container'
import DetailFormRow from '~/containers/detail/DetailFormRow.container'
import DetailHero from '~/containers/detail/DetailHero.container'
import DetailInfoSection from '~/containers/detail/DetailInfoSection.container'
import DetailSignatureMoves from '~/containers/detail/DetailSignatureMoves.container'
import DetailSkills from '~/containers/detail/DetailSkills.container'
import { AdjacentPokemon } from '~/containers/detail/DetailSpeciesNav.container'
import DetailStats from '~/containers/detail/DetailStats.container'
import DetailTypeMatchup from '~/containers/detail/DetailTypeMatchup.container'

interface DetailProps {
  prevPokemon: AdjacentPokemon | null
  nextPokemon: AdjacentPokemon | null
  evolutionPokemons: Array<AdjacentPokemon>
}

const Detail = ({
  prevPokemon,
  nextPokemon,
  evolutionPokemons,
}: DetailProps) => {
  return (
    <>
      <DetailHero prevPokemon={prevPokemon} nextPokemon={nextPokemon} />
      <div className="flex w-full flex-col gap-5 desktop:gap-8">
        <DetailFormRow />
        <DetailStats />
        <div className="flex w-full flex-col gap-5 px-4 desktop:mx-auto desktop:max-w-7xl desktop:gap-8">
          <DetailStatsBanner />
          <DetailInfoSection />
          <DetailExclusiveMoves />
          <DetailSignatureMoves />
          <DetailSkills />
          <DetailSkillsBanner />
          <DetailTypeMatchup />
          <DetailEvolution evolutionPokemons={evolutionPokemons} />
          <DetailBottomBanner />
        </div>
      </div>
    </>
  )
}

export default Detail
