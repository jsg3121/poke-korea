import { ReactNode } from 'react'
import {
  ChampionsMetaSummaryFragment,
  DailyQuizPreview,
  PokemonCardFragment,
} from '~/graphql/typeGenerated'
import HomeChampionsContainer from '~/container/home/HomeChampions.container'
import HomeDailyPokemonContainer from '~/container/home/HomeDailyPokemon.container'
import HomeHubLinksContainer from '~/container/home/HomeHubLinks.container'
import HomeQuizContainer from '~/container/home/HomeQuiz.container'

/**
 * 홈 뷰 (반응형 단일 — UX-003). 데/모 2벌(Home.desktop/Home.mobile)의 콘텐츠를
 * 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응한다(ADR-0007).
 *
 * 섹션 순서(UX-003 개정 — 챔피언스 유입 확대):
 * ① 챔피언스 TOP 3(폴드 위, CTA 카드 직하) → ② 허브 링크 그리드 → [광고 Top] →
 * ③ 오늘의 퀴즈 → ④ 오늘의 포켓몬 → [광고 Bottom]
 *
 * 광고는 항상 렌더되는 정적 섹션(허브) 뒤 — 동적 첫 섹션(챔피언스)이 빈 상태로
 * 사라져도 폴드가 광고로 시작하지 않는다. 광고 유닛은 디바이스별 AdSense 슬롯이
 * 달라 ReactNode로 주입받는다(미노출 유닛의 숨김 렌더는 AdSense 정책 위반이라
 * CSS 분기 불가) — 콘텐츠는 단일, 크롬/광고 선택만 호출부(page) 책임.
 */

interface HomeViewProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz: DailyQuizPreview
  topChampionsPokemons: Array<ChampionsMetaSummaryFragment>
  /** 디바이스별 상단 광고 유닛 (허브 그리드 뒤에 배치됨) */
  topBanner: ReactNode
  /** 디바이스별 하단 광고 유닛 */
  bottomBanner: ReactNode
}

const HomeView = ({
  dailyPokemon,
  dailyQuiz,
  topChampionsPokemons,
  topBanner,
  bottomBanner,
}: HomeViewProps) => {
  return (
    <div className="w-full flex flex-col gap-8 desktop:gap-10">
      <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>

      <HomeChampionsContainer topPokemons={topChampionsPokemons} />
      <HomeHubLinksContainer />
      {topBanner}
      <HomeQuizContainer dailyQuiz={dailyQuiz} />
      <HomeDailyPokemonContainer dailyPokemon={dailyPokemon} />
      {bottomBanner}
    </div>
  )
}

export default HomeView
