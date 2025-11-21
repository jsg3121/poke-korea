import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import DesktopHomeBottomBanner from '~/components/adSlot/DesktopHomeBottomBanner'
import DesktopHomeTopBanner from '~/components/adSlot/DesktopHomeTopBanner'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'
import HomeBannerContainer from '~/container/desktop/home/home.banner/HomeBanner.container'
import HomeQuizContaier from '~/container/desktop/home/home.quiz/HomeQuiz.contaier'
import { DailyQuizPreview, PokemonCardFragment } from '~/graphql/typeGenerated'

interface HomeDesktopProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz: DailyQuizPreview
}

const HomeDesktop = ({ dailyPokemon, dailyQuiz }: HomeDesktopProps) => {
  return (
    <main className="w-full max-w-[1280px] min-h-screen mx-auto pt-40">
      <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>
      <HeaderContainer />
      <DesktopHomeTopBanner />
      <HomeBannerContainer dailyPokemon={dailyPokemon} />
      <HomeQuizContaier dailyQuiz={dailyQuiz} />
      <DesktopHomeBottomBanner />
      <FooterContainer />
    </main>
  )
}

export default HomeDesktop
