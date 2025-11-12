'use client'

import Link from 'next/link'
import { DailyQuizPreview, PokemonCardFragment } from '~/graphql/typeGenerated'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import HeaderContainer from '~/container/desktop/header/Header.container'
import HomeBannerContainer from '~/container/desktop/home/home.banner/HomeBanner.container'
import HomeQuizContaier from '~/container/desktop/home/home.quiz/HomeQuiz.contaier'

interface HomeDesktopProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz: DailyQuizPreview
}

const HomeDesktop = ({ dailyPokemon, dailyQuiz }: HomeDesktopProps) => {
  return (
    <main className="w-full max-w-[1280px] min-h-screen mx-auto pt-56">
      <HeaderContainer />
      <HomeQuizContaier dailyQuiz={dailyQuiz} />
      <HomeBannerContainer dailyPokemon={dailyPokemon} />
      <section
        className="w-full mx-auto mb-20 px-4"
        aria-labelledby="main-features-heading"
      >
        <h2
          id="main-features-heading"
          className="text-3xl font-bold text-primary-4 text-center mb-8"
        >
          주요 기능
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {/* 포켓몬 도감 */}
          <Link
            href="/list"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
            aria-label="포켓몬 도감 페이지로 이동"
          >
            <div className="text-6xl mb-4" aria-hidden="true">
              📋
            </div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              포켓몬 도감
            </h3>
            <p className="text-base text-primary-3">
              1025마리의 포켓몬 정보를 확인하세요
            </p>
          </Link>

          {/* 타입 상성 계산기 */}
          <Link
            href="/type-effectiveness"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
            aria-label="타입 상성 계산기 페이지로 이동"
          >
            <div className="text-6xl mb-4" aria-hidden="true">
              🎯
            </div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              타입 상성 계산기
            </h3>
            <p className="text-base text-primary-3">
              타입별 상성을 빠르게 확인하세요
            </p>
          </Link>

          {/* 기술 도감 */}
          <Link
            href="/moves"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
            aria-label="기술 도감 페이지로 이동"
          >
            <div className="text-6xl mb-4" aria-hidden="true">
              ⚔️
            </div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              기술 도감
            </h3>
            <p className="text-base text-primary-3">
              800개 이상의 포켓몬 기술 정보
            </p>
          </Link>

          {/* 특성 도감 */}
          <Link
            href="/ability"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
            aria-label="특성 도감 페이지로 이동"
          >
            <div className="text-6xl mb-4" aria-hidden="true">
              ✨
            </div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              특성 도감
            </h3>
            <p className="text-base text-primary-3">
              300개 이상의 포켓몬 특성 정보
            </p>
          </Link>

          {/* 포켓몬 퀴즈 */}
          <Link
            href="/quiz"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
            aria-label="포켓몬 퀴즈 페이지로 이동"
          >
            <div className="text-6xl mb-4" aria-hidden="true">
              🎮
            </div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              포켓몬 퀴즈
            </h3>
            <p className="text-base text-primary-3">
              실루엣, 특성, 타입 퀴즈에 도전하세요
            </p>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default HomeDesktop
