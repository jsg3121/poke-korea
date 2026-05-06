import MobileHomeBottomBanner from '~/components/adSlot/MobileHomeBottomBanner'
import MobileHomeTopBanner from '~/components/adSlot/MobileHomeTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import HomeBannerContainer from '~/container/mobile/home/home.banner/HomeBanner.container'
import HomeChampionsContainer from '~/container/mobile/home/home.champions/HomeChampions.container'
import HomeQuizContaier from '~/container/mobile/home/home.quiz/HomeQuiz.contaier'
import {
  ChampionsMetaSummaryFragment,
  DailyQuizPreview,
  PokemonCardFragment,
} from '~/graphql/typeGenerated'

interface HomeMobileProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz: DailyQuizPreview
  topChampionsPokemons: Array<ChampionsMetaSummaryFragment>
}

const HomeMobile = ({
  dailyPokemon,
  dailyQuiz,
  topChampionsPokemons,
}: HomeMobileProps) => {
  return (
    <main className="w-full min-h-screen">
      <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>
      <HeaderContainer />
      <MobileHomeTopBanner />
      <HomeChampionsContainer topPokemons={topChampionsPokemons} />
      <HomeBannerContainer dailyPokemon={dailyPokemon} />
      <HomeQuizContaier dailyQuiz={dailyQuiz} />
      <MobileHomeBottomBanner />
      <FooterContainer />
      <MobileTabBar />
    </main>
  )
}

export default HomeMobile
