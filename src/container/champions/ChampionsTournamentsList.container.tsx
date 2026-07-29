import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner'
import ChampionsBssNotice from '~/components/champions/ChampionsBssNotice.component'
import ChampionsMonthFilter from '~/components/champions/ChampionsMonthFilter.component'
import ChampionsTournamentCard from '~/components/champions/ChampionsTournamentCard.component'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import { CHAMPIONS_SLOTS } from '~/constants/adSense'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'

/**
 * 챔피언스 대회 목록 본문 (반응형 단일, ADR-0007 / UX-011, E-3).
 *
 * 구버전 desktop/mobile 2벌 컨테이너를 CSS 반응형 단일로 통합한다.
 * - 제목: 공용 PageHeaderComponent(champions 4화면 통일, 중앙정렬)
 * - 그리드: grid-cols-1 desktop:grid-cols-2 (구버전 동일)
 * - 카드: ChampionsTournamentCard(전용 카드, DS 코어카드 규격)
 * - 월 필터: sticky 필터바로 승격(-mx로 배경 전체폭, 뒤 카드 비침 방지 — Pokedex 패턴)
 * - 대회 데이터는 소량이므로 무한스크롤 없이 page.tsx에서 전량 SSR 로드(사용자 결정)
 * - 광고(RES-004 재도입): 페이지 헤더 아래(champions 통일). PC 인아티클/모바일
 *   320×100. 컴포넌트 내부 useDevice 분기.
 */
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
    <section className="w-full max-w-[1280px] min-h-dvh mx-auto px-4 pb-8 desktop:px-5">
      <PageHeaderComponent
        title="포켓몬 VGC 대회 결과"
        description="실전 대회 입상팀의 풀빌드를 확인하세요"
      />

      {/* 광고 — 페이지 헤더 아래(champions 통일) */}
      <ChampionsInContentBanner
        mobileSlot={CHAMPIONS_SLOTS.tournamentsListMobile}
        desktopSlot={CHAMPIONS_SLOTS.tournamentsListDesktop}
      />

      <ChampionsBssNotice />

      {/* sticky 필터바. -mx-4/-mx-5로 부모 좌우 패딩을 상쇄해 배경(bg-primary-1)을
          화면 끝까지 깔고, 내부는 px-4/px-5로 다시 들여쓴다. 이렇게 안 하면 sticky
          고정 시 좌우 gutter로 뒤 카드가 비친다(UX-E1 QA / UX-011 피드백).
          top 오프셋은 상단 고정 크롬 실높이와 맞춘다:
          - 모바일 88px = 헤더 h-12(48) + SubNav h-9(36) → 여유 top-[5.5rem]
          - 데스크톱 = 헤더 + SubNav(top-40, Pokedex와 통일) */}
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

export default ChampionsTournamentsListContainer
