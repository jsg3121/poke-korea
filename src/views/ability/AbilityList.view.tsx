'use client'

import { Ability } from '~/graphql/typeGenerated'
import AbilityListContent from '~/containers/ability/AbilityListContent.container'

interface AbilityListProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityList = ({ initialAbilities, totalCount }: AbilityListProps) => {
  return (
    <AbilityListContent
      initialAbilities={initialAbilities}
      totalCount={totalCount}
    />
  )
}

export default AbilityList
