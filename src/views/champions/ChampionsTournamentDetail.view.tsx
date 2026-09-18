import { ChampionsTournamentDetailFragment } from '~/graphql/typeGenerated'
import ChampionsTournamentDetailContent from '~/containers/champions/ChampionsTournamentDetailContent.container'

interface ChampionsTournamentDetailProps {
  detail: ChampionsTournamentDetailFragment
}

/**
 * 챔피언스 대회 상세 뷰 (반응형 단일, ADR-0007 / UX-011, E-3).
 *
 * 구버전 desktop/mobile 2벌 뷰(ChampionsTournamentDetail.desktop/mobile)를 통합한다.
 * 전역 크롬(헤더/푸터/SubNav)은 page.tsx가 담당하고, 본문은 컨테이너에 위임한다.
 */
const ChampionsTournamentDetail = ({
  detail,
}: ChampionsTournamentDetailProps) => {
  return <ChampionsTournamentDetailContent detail={detail} />
}

export default ChampionsTournamentDetail
