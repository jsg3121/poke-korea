import MobileHomeBottomBanner from '~/components/adSlot/MobileHomeBottomBanner'
import MobileHomeTopBanner from '~/components/adSlot/MobileHomeTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import HomeBannerContainer from '~/container/mobile/home/home.banner/HomeBanner.container'
import HomeQuizContaier from '~/container/mobile/home/home.quiz/HomeQuiz.contaier'
import { DailyQuizPreview, PokemonCardFragment } from '~/graphql/typeGenerated'
interface HomeMobileProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz: DailyQuizPreview
}

const HomeMobile = ({ dailyPokemon, dailyQuiz }: HomeMobileProps) => {
  return (
    <main className="w-full min-h-screen">
      <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>
      <HeaderContainer />
      <HomeBannerContainer dailyPokemon={dailyPokemon} />
      <MobileHomeTopBanner />
      <HomeQuizContaier dailyQuiz={dailyQuiz} />
      <MobileHomeBottomBanner />
      <FooterContainer />
      <MobileTabBar />
    </main>
  )
}

export default HomeMobile
