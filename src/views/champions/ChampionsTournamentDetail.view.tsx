import { ChampionsTournamentDetailFragment } from '~/graphql/typeGenerated'
import ChampionsTournamentDetailContent from '~/containers/champions/ChampionsTournamentDetailContent.container'

interface ChampionsTournamentDetailProps {
  detail: ChampionsTournamentDetailFragment
}

const ChampionsTournamentDetail = ({
  detail,
}: ChampionsTournamentDetailProps) => {
  return <ChampionsTournamentDetailContent detail={detail} />
}

export default ChampionsTournamentDetail
