'use client'

import MobileTabBar from '~/components/MobileTabBar'
import ChampionsTournamentsListContainer from '~/container/mobile/champions/ChampionsTournamentsList.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'

interface ChampionsTournamentsListMobileProps {
  tournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  availableMonths: string[]
  currentMonth: string | null
}

const ChampionsTournamentsListMobile = ({
  tournaments,
  availableMonths,
  currentMonth,
}: ChampionsTournamentsListMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <ChampionsTournamentsListContainer
        tournaments={tournaments}
        availableMonths={availableMonths}
        currentMonth={currentMonth}
      />
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsTournamentsListMobile
