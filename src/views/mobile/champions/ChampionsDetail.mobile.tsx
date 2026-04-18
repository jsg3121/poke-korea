'use client'

import Link from 'next/link'
import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import ChampionsDetailContainer from '~/container/mobile/champions/ChampionsDetail.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import {
  ChampionsPokemonCardFragment,
  ChampionsMetaStatsFragment,
} from '~/graphql/typeGenerated'

interface ChampionsDetailMobileProps {
  pokemon: ChampionsPokemonCardFragment
  metaStats: ChampionsMetaStatsFragment | null | undefined
}

const ChampionsDetailMobile = ({
  pokemon,
  metaStats,
}: ChampionsDetailMobileProps) => {
  return (
    <div className="w-full min-h-screen pb-20">
      <nav className="px-4 py-3">
        <Link
          href="/champions/pokedex"
          className="text-sm text-gray-500 hover:text-primary-1"
        >
          &larr; 챔피언스 도감
        </Link>
      </nav>

      <MobileListTopBanner />

      <ChampionsDetailContainer pokemon={pokemon} metaStats={metaStats} />

      <FooterContainer />
      <MobileTabBar />
    </div>
  )
}

export default ChampionsDetailMobile
