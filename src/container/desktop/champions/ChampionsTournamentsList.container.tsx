import ChampionsBssNotice from '~/components/champions/ChampionsBssNotice.component'
import ChampionsMonthFilter from '~/components/champions/ChampionsMonthFilter.component'
import ChampionsTournamentCard from '~/components/champions/ChampionsTournamentCard.component'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'

interface ChampionsTournamentsListContainerProps {
  tournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  availableMonths: string[]
  currentMonth: string | null
}

const ChampionsTournamentsListContainer = ({
  tournaments,
  availableMonths,
  currentMonth,
}: ChampionsTournamentsListContainerProps) => {
  return (
    <section className="w-full max-w-[1280px] mx-auto pb-12 mt-12 px-5">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary-4">포켓몬 대회 결과</h1>
        <p className="text-sm text-primary-3 mt-1">
          실전 대회 입상팀의 풀빌드를 확인하세요
        </p>
      </header>

      <ChampionsBssNotice />

      {availableMonths.length > 0 && (
        <div className="flex items-center justify-end mb-4">
          <ChampionsMonthFilter
            availableMonths={availableMonths}
            currentMonth={currentMonth}
          />
        </div>
      )}

      {tournaments.length === 0 ? (
        <div className="w-full py-16 text-center bg-primary-4 rounded-xl">
          <p className="text-2xl mb-2" aria-hidden="true">
            📦
          </p>
          <p className="text-lg font-bold text-primary-1">
            대회 데이터를 준비 중입니다
          </p>
          <p className="text-sm text-primary-2 mt-1">
            {currentMonth
              ? '선택한 기간에 등록된 대회가 없습니다'
              : '현재 수집된 대회 데이터가 없습니다'}
          </p>
        </div>
      ) : (
        <ul
          className="grid grid-cols-1 desktop:grid-cols-2 gap-6"
          aria-label="대회 목록"
        >
          {tournaments.map((tournament) => (
            <li key={tournament.id} className="w-full">
              <ChampionsTournamentCard tournament={tournament} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ChampionsTournamentsListContainer
