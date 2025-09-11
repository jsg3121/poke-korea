'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { DeviceProvider } from '~/context/Device.context'
import { useSilhouetteQuiz } from '~/context/SilhouetteQuiz.context'
import HeaderContainer from '~/views/mobile/main/header/Header.container'
import { formatTime, formatTimeShort } from '~/utils/quiz.util'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'

const SilhouetteQuizMobile = () => {
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    progress,
    timeElapsed,
    isLoading,
    isCompleted,
    result,
    submitAnswer,
    resetQuiz,
    loadQuestions,
  } = useSilhouetteQuiz()

  useEffect(() => {
    if (questions.length === 0 && !isLoading) {
      loadQuestions()
    }
  }, [questions.length, isLoading, loadQuestions])

  if (isLoading) {
    return (
      <DeviceProvider>
        <div className="min-h-screen bg-gray-50">
          <HeaderContainer />
          <main className="flex items-center justify-center min-h-[calc(100vh-60px)]">
            <div className="text-center px-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">문제를 불러오는 중...</p>
            </div>
          </main>
        </div>
      </DeviceProvider>
    )
  }

  if (isCompleted && result) {
    return (
      <DeviceProvider>
        <div className="min-h-screen bg-gray-50">
          <HeaderContainer />
          <main className="px-4 py-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  실루엣 퀴즈 완료!
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {result.correctAnswers}
                  </div>
                  <div className="text-xs text-gray-600">맞은 문제</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {result.percentage}%
                  </div>
                  <div className="text-xs text-gray-600">정답률</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {formatTime(result.totalTime)}
                  </div>
                  <div className="text-xs text-gray-600">총 시간</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {formatTime(result.averageTime)}
                  </div>
                  <div className="text-xs text-gray-600">평균 시간</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={resetQuiz}
                  className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg active:scale-95 transition-all"
                >
                  다시 도전하기
                </button>
                <Link
                  href={QUIZ_ROUTES.MAIN}
                  className="block w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg text-center active:scale-95 transition-all"
                >
                  다른 퀴즈 해보기
                </Link>
              </div>
            </div>
          </main>
        </div>
      </DeviceProvider>
    )
  }

  if (!currentQuestion) {
    return (
      <DeviceProvider>
        <div className="min-h-screen bg-gray-50">
          <HeaderContainer />
          <main className="flex items-center justify-center min-h-[calc(100vh-60px)]">
            <div className="text-center px-4">
              <p className="text-gray-600 mb-4 text-sm">
                문제를 불러올 수 없습니다.
              </p>
              <button
                onClick={loadQuestions}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg active:scale-95 transition-all"
              >
                다시 시도
              </button>
            </div>
          </main>
        </div>
      </DeviceProvider>
    )
  }

  return (
    <DeviceProvider>
      <div className="min-h-screen bg-gray-50">
        <HeaderContainer />

        <main className="px-4 py-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-bold text-gray-800">실루엣 퀴즈</h1>
                <p className="text-sm text-gray-600">
                  문제 {currentQuestionIndex + 1} / 20
                </p>
              </div>
              <div className="text-right">
                <div className="text-base font-medium text-purple-600">
                  {formatTimeShort(timeElapsed)}
                </div>
                <div className="text-xs text-gray-600">경과 시간</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-6 text-center leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => submitAnswer(index)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg active:border-purple-300 active:bg-purple-50 transition-all duration-200 font-medium active:scale-[0.98]"
                >
                  <span className="inline-block w-6 h-6 bg-gray-100 rounded-full text-center text-sm mr-3 leading-6">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              href={QUIZ_ROUTES.MAIN}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              퀴즈 목록으로 돌아가기
            </Link>
          </div>
        </main>
      </div>
    </DeviceProvider>
  )
}

export default SilhouetteQuizMobile
