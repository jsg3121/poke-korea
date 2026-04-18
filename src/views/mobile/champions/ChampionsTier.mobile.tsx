'use client'

import Link from 'next/link'
import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import ChampionsTierContainer from '~/container/mobile/champions/ChampionsTier.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface TierGroups {
  S: ChampionsMetaSummaryFragment[]
  A: ChampionsMetaSummaryFragment[]
  B: ChampionsMetaSummaryFragment[]
  C: ChampionsMetaSummaryFragment[]
  D: ChampionsMetaSummaryFragment[]
}

interface ChampionsTierMobileProps {
  tierGroups: TierGroups
}

const ChampionsTierMobile = ({ tierGroups }: ChampionsTierMobileProps) => {
  return (
    <div className="w-full min-h-screen pb-20">
      <nav className="px-4 py-3">
        <Link
          href="/champions"
          className="text-sm text-gray-500 hover:text-primary-1"
        >
          &larr; 챔피언스 홈
        </Link>
      </nav>

      <MobileListTopBanner />

      <div className="px-4 mt-6">
        <ChampionsTierContainer tierGroups={tierGroups} />
      </div>

      <FooterContainer />
      <MobileTabBar />
    </div>
  )
}

export default ChampionsTierMobile
