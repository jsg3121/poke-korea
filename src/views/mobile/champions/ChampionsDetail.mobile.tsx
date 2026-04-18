'use client'

import Link from 'next/link'
import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainer from '~/container/mobile/header/Header.container'
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
    <>
      <HeaderContainer />
      <MobileListTopBanner />
      <section className="w-full min-h-dvh px-4 py-6">
        <nav className="mb-4">
          <Link
            href="/champions/pokedex"
            className="text-sm text-gray-500 hover:text-primary-1"
          >
            &larr; 챔피언스 도감
          </Link>
        </nav>
        <ChampionsDetailContainer pokemon={pokemon} metaStats={metaStats} />
      </section>
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsDetailMobile
