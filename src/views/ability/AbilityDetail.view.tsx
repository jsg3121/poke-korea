'use client'

import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'
import PokemonByAbility from '~/containers/ability/PokemonByAbility.container'

interface AbilityDetailProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
  totalCount: number
}

const AbilityDetail = ({
  abilityId,
  initialAbility,
  initialPokemon,
  totalCount,
}: AbilityDetailProps) => {
  return (
    <PokemonByAbility
      abilityId={abilityId}
      initialAbility={initialAbility}
      initialPokemon={initialPokemon}
      totalCount={totalCount}
    />
  )
}

export default AbilityDetail
