'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsTournamentsListContainer from '~/container/desktop/champions/ChampionsTournamentsList.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'

interface ChampionsTournamentsListDesktopProps {
  tournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  availableMonths: string[]
  currentMonth: string | null
}

const ChampionsTournamentsListDesktop = ({
  tournaments,
  availableMonths,
  currentMonth,
}: ChampionsTournamentsListDesktopProps) => {
  return (
    <>
      <div className="h-32">
        <HeaderContainer />
      </div>
      <ChampionsTournamentsListContainer
        tournaments={tournaments}
        availableMonths={availableMonths}
        currentMonth={currentMonth}
      />
      <FooterContainer />
    </>
  )
}

export default ChampionsTournamentsListDesktop
