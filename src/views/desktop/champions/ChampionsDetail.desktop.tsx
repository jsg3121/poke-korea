'use client'

import Link from 'next/link'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ChampionsDetailContainer from '~/container/desktop/champions/ChampionsDetail.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import {
  ChampionsPokemonCardFragment,
  ChampionsMetaStatsFragment,
} from '~/graphql/typeGenerated'

interface ChampionsDetailDesktopProps {
  pokemon: ChampionsPokemonCardFragment
  metaStats: ChampionsMetaStatsFragment | null | undefined
}

const ChampionsDetailDesktop = ({
  pokemon,
  metaStats,
}: ChampionsDetailDesktopProps) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto py-12 px-5">
      <nav className="mb-6">
        <Link
          href="/champions/pokedex"
          className="text-sm text-gray-500 hover:text-primary-1"
        >
          &larr; 챔피언스 도감으로 돌아가기
        </Link>
      </nav>

      <DesktopListTopBanner />

      <div className="mt-8">
        <ChampionsDetailContainer pokemon={pokemon} metaStats={metaStats} />
      </div>

      <FooterContainer />
    </div>
  )
}

export default ChampionsDetailDesktop
