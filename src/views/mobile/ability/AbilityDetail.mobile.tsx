'use client'

import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import PokemonByAbilityContainer from '~/container/mobile/ability/PokemonByAbility.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MobileTabBar from '~/components/MobileTabBar'

interface AbilityDetailMobileProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
  totalCount: number
}

const AbilityDetailMobile = ({
  abilityId,
  initialAbility,
  initialPokemon,
  totalCount,
}: AbilityDetailMobileProps) => {
  return (
    <main className="w-full mx-auto min-h-screen">
      <HeaderContainer />
      <PokemonByAbilityContainer
        abilityId={abilityId}
        initialAbility={initialAbility}
        initialPokemon={initialPokemon}
        totalCount={totalCount}
      />
      <MobileTabBar />
    </main>
  )
}

export default AbilityDetailMobile
