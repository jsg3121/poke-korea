import ChampionsTournamentsListContainer from '~/container/champions/ChampionsTournamentsList.container'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'

interface ChampionsTournamentsListViewProps {
  tournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  availableMonths: string[]
  currentMonth: string | null
}

/**
 * 챔피언스 대회 목록 뷰 (반응형 단일, ADR-0007 / UX-011, E-3).
 *
 * 구버전 desktop/mobile 2벌 뷰(ChampionsTournamentsList.desktop/mobile)를 통합한다.
 * 전역 크롬(헤더/푸터/SubNav)은 page.tsx가 담당하고, 본문은 컨테이너에 위임한다
 * (champions 다른 화면과 동일 패턴). 무한스크롤 없이 전량 SSR 로드라 Provider 불필요.
 */
const ChampionsTournamentsListView = ({
  tournaments,
  availableMonths,
  currentMonth,
}: ChampionsTournamentsListViewProps) => {
  return (
    <ChampionsTournamentsListContainer
      tournaments={tournaments}
      availableMonths={availableMonths}
      currentMonth={currentMonth}
    />
  )
}

export default ChampionsTournamentsListView
