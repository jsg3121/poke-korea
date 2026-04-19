'use client'

import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ChampionsSubNav from '~/components/champions/ChampionsSubNav.component'
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
      <ChampionsSubNav />
      <DesktopListTopBanner />
      <section className="w-full max-w-[1280px] min-h-dvh mx-auto py-12 px-5">
        <ChampionsTierContainer tierGroups={tierGroups} />
      </section>
      <FooterContainer />
    </>
  )
}

export default ChampionsTierDesktop
