import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'
import ChampionsHomeSectionHeader from './ChampionsHomeSectionHeader.component'
import ChampionsTournamentCard from './ChampionsTournamentCard.component'

interface ChampionsRecentTournamentsSectionProps {
  tournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
}

/**
 * Phase 1 홈에 추가되는 "최근 대회 결과" 섹션.
 * 데스크탑/모바일 모두 가로 스크롤 3개 카드 (A 티어 슬라이드 패턴 응용).
 *
 * Why: 사용자 결정 — 빠른 진입 카드 위에 배치, 인기 조합 아래.
 *      "실전 검증된 빌드" 가치를 홈에서 미리 알리는 진입 훅 역할.
 */
const ChampionsRecentTournamentsSection = ({
  tournaments,
}: ChampionsRecentTournamentsSectionProps) => {
  if (tournaments.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="recent-tournaments-heading"
      className="w-full mb-8 desktop:mb-12"
    >
      <div id="recent-tournaments-heading">
        <ChampionsHomeSectionHeader
          title="최근 대회 결과"
          description="실전 우승팀 빌드 확인"
          moreHref="/champions/tournaments"
          moreLabel="전체 보기"
        />
      </div>
      <ul
        className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
        aria-label="최근 대회 슬라이드"
      >
        {tournaments.slice(0, 3).map((tournament) => (
          <li key={tournament.id} className="w-[280px] flex-shrink-0 px-1 py-1">
            <ChampionsTournamentCard tournament={tournament} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ChampionsRecentTournamentsSection
