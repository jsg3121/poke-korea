'use client'

import MobileTabBar from '~/components/MobileTabBar'
import ChampionsDetailContainer from '~/container/mobile/champions/ChampionsDetail.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'

interface ChampionsDetailMobileProps {
  detail: ChampionsPokemonDetailFragment
}

const ChampionsDetailMobile = ({ detail }: ChampionsDetailMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <section className="w-full min-h-dvh px-4 py-6">
        <ChampionsDetailContainer detail={detail} />
      </section>
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsDetailMobile
