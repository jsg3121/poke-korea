'use client'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
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
    <main className="w-full max-w-[1280px] min-h-screen mx-auto pt-56">
      <HeaderContainer />
      <HomeBannerContainer dailyPokemon={dailyPokemon} />
      <HomeQuizContaier dailyQuiz={dailyQuiz} />
      <FooterContainer />
    </main>
  )
}

export default HomeDesktop
