'use client'

import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainer from '~/container/mobile/header/Header.container'
import ChampionsHomeContainer from '~/container/mobile/champions/ChampionsHome.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeMobileProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeMobile = ({ topPokemons }: ChampionsHomeMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <MobileListTopBanner />
      <section className="w-full min-h-dvh px-4 py-6">
        <ChampionsHomeContainer topPokemons={topPokemons} />
      </section>
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsHomeMobile
