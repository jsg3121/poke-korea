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
      <HeaderContainer />
      <HomeBannerContainer dailyPokemon={dailyPokemon} />
      <HomeQuizContaier dailyQuiz={dailyQuiz} />
      <FooterContainer />
      <MobileTabBar />
    </main>
  )
}

export default HomeMobile
