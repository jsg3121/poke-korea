'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsTournamentDetailContainer from '~/container/desktop/champions/ChampionsTournamentDetail.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsTournamentDetailFragment } from '~/graphql/typeGenerated'

interface ChampionsTournamentDetailDesktopProps {
  detail: ChampionsTournamentDetailFragment
}

const ChampionsTournamentDetailDesktop = ({
  detail,
}: ChampionsTournamentDetailDesktopProps) => {
  return (
    <>
      <div className="h-32">
        <HeaderContainer />
      </div>
      <ChampionsTournamentDetailContainer detail={detail} />
      <FooterContainer />
    </>
  )
}

export default ChampionsTournamentDetailDesktop
