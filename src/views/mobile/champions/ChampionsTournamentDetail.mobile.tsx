'use client'

import MobileTabBar from '~/components/MobileTabBar'
import ChampionsTournamentDetailContainer from '~/container/mobile/champions/ChampionsTournamentDetail.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import { ChampionsTournamentDetailFragment } from '~/graphql/typeGenerated'

interface ChampionsTournamentDetailMobileProps {
  detail: ChampionsTournamentDetailFragment
}

const ChampionsTournamentDetailMobile = ({
  detail,
}: ChampionsTournamentDetailMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <ChampionsTournamentDetailContainer detail={detail} />
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsTournamentDetailMobile
