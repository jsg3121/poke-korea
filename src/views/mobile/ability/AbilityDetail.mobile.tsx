'use client'

import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import PokemonByAbilityContainer from '~/container/mobile/ability/PokemonByAbility.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MobileTabBar from '~/components/MobileTabBar'

interface AbilityDetailMobileProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
}

const AbilityDetailMobile = ({
  abilityId,
  initialAbility,
  initialPokemon,
}: AbilityDetailMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <PokemonByAbilityContainer
        abilityId={abilityId}
        initialAbility={initialAbility}
        initialPokemon={initialPokemon}
      />
      <MobileTabBar />
    </>
  )
}

export default AbilityDetailMobile
