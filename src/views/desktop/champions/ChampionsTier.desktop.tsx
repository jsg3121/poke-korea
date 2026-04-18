'use client'

import Link from 'next/link'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsTierContainer from '~/container/desktop/champions/ChampionsTier.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface TierGroups {
  S: ChampionsMetaSummaryFragment[]
  A: ChampionsMetaSummaryFragment[]
  B: ChampionsMetaSummaryFragment[]
  C: ChampionsMetaSummaryFragment[]
  D: ChampionsMetaSummaryFragment[]
}

interface ChampionsTierDesktopProps {
  tierGroups: TierGroups
}

const ChampionsTierDesktop = ({ tierGroups }: ChampionsTierDesktopProps) => {
  return (
    <>
      <div className="h-40">
        <HeaderContainer />
      </div>
      <DesktopListTopBanner />
      <section className="w-full max-w-[1280px] min-h-dvh mx-auto py-12 px-5">
        <nav className="mb-6">
          <Link
            href="/champions"
            className="text-sm text-gray-500 hover:text-primary-1"
          >
            &larr; 챔피언스 홈으로
          </Link>
        </nav>
        <ChampionsTierContainer tierGroups={tierGroups} />
      </section>
      <FooterContainer />
    </>
  )
}

export default ChampionsTierDesktop
