'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import PokemonCardComponent from '~/container/desktop/List/list.pokemonCard/PokemonCard.component'
import { DailyQuizPreview, PokemonCardFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import QuizResultPopup from '~/components/QuizResultPopup.component'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface HomeMobileProps {
  dailyPokemon: Array<PokemonCardFragment>
  dailyQuiz?: DailyQuizPreview
}

const HomeMobile = ({ dailyPokemon, dailyQuiz }: HomeMobileProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    ability?: number
    silhouette?: number
    type?: number
  }>({})

  const [popupState, setPopupState] = useState<{
    isOpen: boolean
    isCorrect: boolean
    quizType: 'ability' | 'silhouette' | 'type' | null
  }>({
    isOpen: false,
    isCorrect: false,
    quizType: null,
  })

  const handleAnswerSelect = (
    quizType: 'ability' | 'silhouette' | 'type',
    answerIndex: number,
  ) => {
    if (!dailyQuiz) return

    // 정답 확인
    let correctAnswerIndex = 0
    if (quizType === 'ability') {
      correctAnswerIndex = dailyQuiz.abilityQuiz.correctAnswerIndex
    } else if (quizType === 'silhouette') {
      correctAnswerIndex = dailyQuiz.silhouetteQuiz.correctAnswerIndex
    } else if (quizType === 'type') {
      correctAnswerIndex = dailyQuiz.typeQuiz.correctAnswerIndex
    }

    const isCorrect = answerIndex === correctAnswerIndex

    // 선택한 답안 저장
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizType]: answerIndex,
    }))

    // 팝업 표시
    setPopupState({
      isOpen: true,
      isCorrect,
      quizType,
    })
  }

  const handleClosePopup = () => {
    setPopupState({
      isOpen: false,
      isCorrect: false,
      quizType: null,
    })
  }

  return (
    <>
      <main className="w-full min-h-screen bg-gradient-to-b from-primary-1 to-primary-2 py-8 px-4">
        {/* 헤더 섹션 */}
        <header className="max-w-6xl mx-auto text-center mb-12 px-4">
          <h1 className="text-4xl font-bold text-primary-4 mb-4 animate-fadeIn">
            포케 코리아
          </h1>
          <p className="text-lg text-primary-3 animate-fadeIn">
            한국어로 만나는 포켓몬 도감
          </p>
        </header>

        {/* 주요 기능 링크 섹션 */}
        <section
          className="max-w-6xl mx-auto mb-16 px-4"
          aria-labelledby="main-features-heading"
        >
          <h2
            id="main-features-heading"
            className="text-2xl font-bold text-primary-4 text-center mb-6"
          >
            주요 기능
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {/* 포켓몬 도감 */}
            <Link
              href="/list"
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
              aria-label="포켓몬 도감 페이지로 이동"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                📋
              </div>
              <h3 className="text-xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
                포켓몬 도감
              </h3>
              <p className="text-sm text-primary-3">
                1025마리의 포켓몬 정보를 확인하세요
              </p>
            </Link>

            {/* 타입 상성 계산기 */}
            <Link
              href="/type-effectiveness"
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
              aria-label="타입 상성 계산기 페이지로 이동"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                🎯
              </div>
              <h3 className="text-xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
                타입 상성 계산기
              </h3>
              <p className="text-sm text-primary-3">
                타입별 상성을 빠르게 확인하세요
              </p>
            </Link>

            {/* 기술 도감 */}
            <Link
              href="/moves"
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
              aria-label="기술 도감 페이지로 이동"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                ⚔️
              </div>
              <h3 className="text-xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
                기술 도감
              </h3>
              <p className="text-sm text-primary-3">
                800개 이상의 포켓몬 기술 정보
              </p>
            </Link>

            {/* 특성 도감 */}
            <Link
              href="/ability"
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
              aria-label="특성 도감 페이지로 이동"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                ✨
              </div>
              <h3 className="text-xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
                특성 도감
              </h3>
              <p className="text-sm text-primary-3">
                300개 이상의 포켓몬 특성 정보
              </p>
            </Link>

            {/* 포켓몬 퀴즈 */}
            <Link
              href="/quiz"
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-3"
              aria-label="포켓몬 퀴즈 페이지로 이동"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                🎮
              </div>
              <h3 className="text-xl font-bold text-primary-4 mb-2 group-hover:text-blue-600 transition-colors">
                포켓몬 퀴즈
              </h3>
              <p className="text-sm text-primary-3">
                실루엣, 특성, 타입 퀴즈에 도전하세요
              </p>
            </Link>
          </div>
        </section>

        {/* 오늘의 랜덤 포켓몬 슬라이더 */}
        <section
          className="max-w-7xl mx-auto mb-16"
          aria-labelledby="daily-pokemon-heading"
        >
          <h2
            id="daily-pokemon-heading"
            className="text-2xl font-bold text-primary-4 text-center mb-6 px-4"
          >
            오늘의 랜덤 포켓몬
          </h2>
          <div
            className="px-4"
            role="region"
            aria-label="오늘의 랜덤 포켓몬 슬라이드"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              loop
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="py-8 [&_.swiper-button-next]:!text-primary-4 [&_.swiper-button-prev]:!text-primary-4 [&_.swiper-button-next]:!bg-primary-1/80 [&_.swiper-button-prev]:!bg-primary-1/80 [&_.swiper-button-next]:!w-10 [&_.swiper-button-prev]:!w-10 [&_.swiper-button-next]:!h-10 [&_.swiper-button-prev]:!h-10 [&_.swiper-button-next]:!rounded-full [&_.swiper-button-prev]:!rounded-full [&_.swiper-pagination-bullet]:!bg-primary-3 [&_.swiper-pagination-bullet-active]:!bg-primary-4 [&_.swiper-wrapper]:!ease-linear"
            >
              {dailyPokemon.map((pokemon) => (
                <SwiperSlide
                  key={pokemon.id}
                  className="flex justify-center !h-auto"
                >
                  <PokemonCardComponent pokemonData={pokemon} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* 오늘의 퀴즈 섹션 */}
        {dailyQuiz && (
          <section
            className="max-w-6xl mx-auto px-4"
            aria-labelledby="daily-quiz-heading"
          >
            <h2
              id="daily-quiz-heading"
              className="text-2xl font-bold text-primary-4 text-center mb-6"
            >
              오늘의 퀴즈
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* 실루엣 퀴즈 */}
              <article
                className="bg-white rounded-2xl p-5 shadow-lg"
                aria-labelledby="silhouette-quiz-title"
              >
                <h3
                  id="silhouette-quiz-title"
                  className="text-lg font-bold text-primary-4 mb-4 flex items-center gap-2"
                >
                  <span className="text-xl" aria-hidden="true">
                    🔍
                  </span>
                  실루엣 퀴즈
                </h3>
                <p className="text-primary-2 mb-4 text-xs font-medium">
                  {dailyQuiz.silhouetteQuiz.question}
                </p>
                <div className="mb-4 bg-gradient-to-br from-primary-1 to-primary-2 rounded-xl p-4 flex items-center justify-center">
                  <img
                    src={`${imageMode}/${dailyQuiz.silhouetteQuiz.correctPokemonId}.webp?w=240&h=240`}
                    alt="포켓몬 실루엣 이미지"
                    className="w-28 h-28 object-contain brightness-0"
                  />
                </div>
                <div
                  className="space-y-2"
                  role="group"
                  aria-label="실루엣 퀴즈 답안 선택"
                >
                  {dailyQuiz.silhouetteQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect('silhouette', index)}
                      className={`w-full p-2.5 rounded-lg text-left text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-3 ${
                        selectedAnswers.silhouette === index
                          ? 'bg-primary-4 text-primary-1 shadow-md'
                          : 'bg-primary-1/10 text-primary-2 hover:bg-primary-1/20'
                      }`}
                      aria-pressed={selectedAnswers.silhouette === index}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </article>

              {/* 특성 퀴즈 */}
              <article
                className="bg-white rounded-2xl p-5 shadow-lg"
                aria-labelledby="ability-quiz-title"
              >
                <h3
                  id="ability-quiz-title"
                  className="text-lg font-bold text-primary-4 mb-4 flex items-center gap-2"
                >
                  <span className="text-xl" aria-hidden="true">
                    ✨
                  </span>
                  특성 퀴즈
                </h3>
                <p className="text-primary-2 mb-4 text-xs font-medium">
                  {dailyQuiz.abilityQuiz.question}
                </p>
                <div className="mb-4 bg-gradient-to-br from-primary-1 to-primary-2 rounded-xl p-4">
                  <p className="text-primary-4 text-xs leading-relaxed">
                    {dailyQuiz.abilityQuiz.abilityDescription}
                  </p>
                </div>
                <div
                  className="space-y-2"
                  role="group"
                  aria-label="특성 퀴즈 답안 선택"
                >
                  {dailyQuiz.abilityQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect('ability', index)}
                      className={`w-full p-2.5 rounded-lg text-left text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-3 ${
                        selectedAnswers.ability === index
                          ? 'bg-primary-4 text-primary-1 shadow-md'
                          : 'bg-primary-1/10 text-primary-2 hover:bg-primary-1/20'
                      }`}
                      aria-pressed={selectedAnswers.ability === index}
                    >
                      {option.koreanName}
                    </button>
                  ))}
                </div>
              </article>

              {/* 타입 퀴즈 */}
              <article
                className="bg-white rounded-2xl p-5 shadow-lg"
                aria-labelledby="type-quiz-title"
              >
                <h3
                  id="type-quiz-title"
                  className="text-lg font-bold text-primary-4 mb-4 flex items-center gap-2"
                >
                  <span className="text-xl" aria-hidden="true">
                    🎯
                  </span>
                  타입 퀴즈
                </h3>
                <p className="text-primary-2 mb-4 text-xs font-medium">
                  {dailyQuiz.typeQuiz.question}
                </p>
                <div className="mb-4 bg-gradient-to-br from-primary-1 to-primary-2 rounded-xl p-4 flex items-center justify-center">
                  <span className="text-primary-4 text-base font-bold">
                    {dailyQuiz.typeQuiz.targetType} 타입
                  </span>
                </div>
                <div
                  className="space-y-2"
                  role="group"
                  aria-label="타입 퀴즈 답안 선택"
                >
                  {dailyQuiz.typeQuiz.options.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect('type', index)}
                      className={`w-full p-2.5 rounded-lg text-left text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-3 ${
                        selectedAnswers.type === index
                          ? 'bg-primary-4 text-primary-1 shadow-md'
                          : 'bg-primary-1/10 text-primary-2 hover:bg-primary-1/20'
                      }`}
                      aria-pressed={selectedAnswers.type === index}
                    >
                      {option.koreanName}
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </section>
        )}

        {/* 퀴즈 결과 팝업 */}
        {popupState.quizType && (
          <QuizResultPopup
            isOpen={popupState.isOpen}
            isCorrect={popupState.isCorrect}
            quizType={popupState.quizType}
            onClose={handleClosePopup}
          />
        )}
      </main>
    </>
  )
}

export default HomeMobile
