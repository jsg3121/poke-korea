'use client'

import Link from 'next/link'
import MobileTabBar from '~/components/MobileTabBar'
import ChampionsTierContainer from '~/container/mobile/champions/ChampionsTier.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
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
    <>
      <HeaderContainer />
      <section className="w-full min-h-dvh px-4 py-6">
        <nav className="mb-4">
          <Link
            href="/champions"
            className="text-sm text-gray-500 hover:text-primary-1"
          >
            &larr; 챔피언스 홈
          </Link>
        </nav>
        <ChampionsTierContainer tierGroups={tierGroups} />
      </section>
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsTierMobile
