'use client'

import ChampionsSubNavMobile from '~/components/champions/ChampionsSubNavMobile.component'
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
      <ChampionsSubNavMobile />
      <section className="w-full min-h-dvh px-4 py-6">
        <ChampionsTierContainer tierGroups={tierGroups} />
      </section>
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsTierMobile
