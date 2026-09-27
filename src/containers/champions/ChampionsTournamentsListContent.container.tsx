import { CHAMPIONS_SLOTS } from '~/constants/adSense'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'
import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner.component'
import ChampionsBssNotice from '~/components/champions/ChampionsBssNotice.component'
import ChampionsMonthFilter from '~/components/champions/ChampionsMonthFilter.component'
import ChampionsTournamentCard from '~/components/champions/ChampionsTournamentCard.component'
import PageHeader from '~/components/pageHeader/PageHeader.component'

interface ChampionsTournamentsListContentProps {
  tournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  availableMonths: string[]
  currentMonth: string | null
}

const ChampionsTournamentsListContent = ({
  tournaments,
  availableMonths,
  currentMonth,
}: ChampionsTournamentsListContentProps) => {
  return (
    <section className="w-full max-w-[1280px] min-h-dvh mx-auto px-4 pb-8 desktop:px-5">
      <PageHeader
        title="포켓몬 VGC 대회 결과"
        description="실전 대회 입상팀의 풀빌드를 확인하세요"
      />

      <ChampionsInContentBanner
        mobileSlot={CHAMPIONS_SLOTS.tournamentsListMobile}
        desktopSlot={CHAMPIONS_SLOTS.tournamentsListDesktop}
      />

      <ChampionsBssNotice />

      <div className="sticky top-[5.2rem] z-20 -mx-4 mb-4 px-4 bg-primary-1 shadow-[0_3px_3px_-2px_var(--color-black-1)] desktop:top-40 desktop:-mx-5 desktop:mb-6 desktop:px-5">
        <div className="flex items-center justify-between py-1.5 border-t border-primary-2/30">
          <p className="text-xs text-primary-3">
            총 <b className="font-bold">{tournaments.length}건</b>의 대회 결과
          </p>
          {availableMonths.length > 0 && (
            <ChampionsMonthFilter
              availableMonths={availableMonths}
              currentMonth={currentMonth}
            />
          )}
        </div>
      </div>

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
          className="grid grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-6"
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

export default ChampionsTournamentsListContent
