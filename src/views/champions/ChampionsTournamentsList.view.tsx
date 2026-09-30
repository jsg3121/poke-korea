import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'
import ChampionsTournamentsListContent from '~/containers/champions/ChampionsTournamentsListContent.container'

interface ChampionsTournamentsListProps {
  tournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  availableMonths: string[]
  currentMonth: string | null
}

const ChampionsTournamentsList = ({
  tournaments,
  availableMonths,
  currentMonth,
}: ChampionsTournamentsListProps) => {
  return (
    <ChampionsTournamentsListContent
      tournaments={tournaments}
      availableMonths={availableMonths}
      currentMonth={currentMonth}
    />
  )
}

export default ChampionsTournamentsList
