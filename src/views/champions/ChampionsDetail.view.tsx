'use client'

import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ChampionsDetailContent from '~/containers/champions/ChampionsDetailContent.container'

interface ChampionsDetailProps {
  detail: ChampionsPokemonDetailFragment
  formatSlug: ChampionsFormatSlug
}

const ChampionsDetail = ({ detail, formatSlug }: ChampionsDetailProps) => {
  return <ChampionsDetailContent detail={detail} formatSlug={formatSlug} />
}

export default ChampionsDetail
