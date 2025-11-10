'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import PokemonCardComponent from '~/container/desktop/List/list.pokemonCard/PokemonCard.component'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface HomeViewProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const HomeView = ({ dailyPokemon }: HomeViewProps) => {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-primary-1 to-primary-2 py-12 px-4">
      {/* 헤더 섹션 */}
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-4 mb-4">
          포케 코리아
        </h1>
        <p className="text-xl md:text-2xl text-primary-3">
          한국어로 만나는 포켓몬 도감
        </p>
      </header>

      {/* 주요 기능 링크 섹션 */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-primary-4 text-center mb-8">
          주요 기능
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 포켓몬 도감 */}
          <Link
            href="/list"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              포켓몬 도감
            </h3>
            <p className="text-primary-3">
              1025마리의 포켓몬 정보를 확인하세요
            </p>
          </Link>

          {/* 타입 상성 계산기 */}
          <Link
            href="/type-effectiveness"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              타입 상성 계산기
            </h3>
            <p className="text-primary-3">타입별 상성을 빠르게 확인하세요</p>
          </Link>

          {/* 기술 도감 */}
          <Link
            href="/moves"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4">⚔️</div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              기술 도감
            </h3>
            <p className="text-primary-3">800개 이상의 포켓몬 기술 정보</p>
          </Link>

          {/* 특성 도감 */}
          <Link
            href="/ability"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              특성 도감
            </h3>
            <p className="text-primary-3">300개 이상의 포켓몬 특성 정보</p>
          </Link>

          {/* 포켓몬 퀴즈 */}
          <Link
            href="/quiz"
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
              포켓몬 퀴즈
            </h3>
            <p className="text-primary-3">
              실루엣, 특성, 타입 퀴즈에 도전하세요
            </p>
          </Link>
        </div>
      </section>

      {/* 오늘의 인기 포켓몬 슬라이더 */}
      <section className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-primary-4 text-center mb-8">
          오늘의 인기 포켓몬
        </h2>
        <div className="px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            loop
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            className="py-8 [&_.swiper-button-next]:!text-primary-4 [&_.swiper-button-prev]:!text-primary-4 [&_.swiper-button-next]:!bg-primary-1/80 [&_.swiper-button-prev]:!bg-primary-1/80 [&_.swiper-button-next]:!w-12 [&_.swiper-button-prev]:!w-12 [&_.swiper-button-next]:!h-12 [&_.swiper-button-prev]:!h-12 [&_.swiper-button-next]:!rounded-full [&_.swiper-button-prev]:!rounded-full [&_.swiper-pagination-bullet]:!bg-primary-3 [&_.swiper-pagination-bullet-active]:!bg-primary-4"
          >
            {dailyPokemon.map((pokemon) => (
              <SwiperSlide key={pokemon.id} className="flex justify-center">
                <PokemonCardComponent pokemonData={pokemon} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 오늘의 퀴즈 섹션 (Phase 4에서 추가 예정) */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-primary-4 text-center mb-8">
          오늘의 퀴즈
        </h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <p className="text-primary-3">퀴즈 섹션 구현 예정...</p>
        </div>
      </section>
    </main>
  )
}

export default HomeView
