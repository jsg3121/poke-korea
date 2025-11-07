'use client'

import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import PokemonByAbilityContainer from '~/container/desktop/ability/PokemonByAbility.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

interface AbilityDetailDesktopProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
}

const AbilityDetailDesktop = ({
  abilityId,
  initialAbility,
  initialPokemon,
}: AbilityDetailDesktopProps) => {
  return (
    <>
      <div className="h-56">
        <HeaderContainer />
      </div>
      <PokemonByAbilityContainer
        abilityId={abilityId}
        initialAbility={initialAbility}
        initialPokemon={initialPokemon}
      />
    </>
  )
}

export default AbilityDetailDesktop
