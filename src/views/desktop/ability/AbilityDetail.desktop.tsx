'use client'

import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import PokemonByAbilityContainer from '~/container/desktop/ability/PokemonByAbility.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

interface AbilityDetailDesktopProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
  totalCount: number
}

const AbilityDetailDesktop = ({
  abilityId,
  initialAbility,
  initialPokemon,
  totalCount,
}: AbilityDetailDesktopProps) => {
  return (
    <main className="w-full h-full pt-40">
      <HeaderContainer />
      <PokemonByAbilityContainer
        abilityId={abilityId}
        initialAbility={initialAbility}
        initialPokemon={initialPokemon}
        totalCount={totalCount}
      />
    </main>
  )
}

export default AbilityDetailDesktop
