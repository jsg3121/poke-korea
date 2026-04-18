'use client'

import Link from 'next/link'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import HeaderContainer from '~/container/desktop/header/Header.container'
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
    <>
      <div className="h-40">
        <HeaderContainer />
      </div>
      <DesktopListTopBanner />
      <section className="w-full max-w-[1280px] min-h-dvh mx-auto py-12 px-5">
        <nav className="mb-6">
          <Link
            href="/champions/pokedex"
            className="text-sm text-gray-500 hover:text-primary-1"
          >
            &larr; 챔피언스 도감으로 돌아가기
          </Link>
        </nav>
        <ChampionsDetailContainer pokemon={pokemon} metaStats={metaStats} />
      </section>
      <FooterContainer />
    </>
  )
}

export default ChampionsDetailDesktop
