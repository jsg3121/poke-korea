import { Fragment, useState } from 'react'
import { DailyQuizPreview } from '~/graphql/typeGenerated'
import SilhouetteQuizCardCntainer from './quiz.quizCard/SilhouetteQuizCard.cntainer'

interface HomeQuizContaierProps {
  dailyQuiz: DailyQuizPreview
}

const HomeQuizContaier = ({ dailyQuiz }: HomeQuizContaierProps) => {
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

  const handleClosePopup = () => {
    setPopupState({
      isOpen: false,
      isCorrect: false,
      quizType: null,
    })
  }

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

  return (
    <Fragment>
      <section className="w-full mx-auto" aria-labelledby="daily-quiz-heading">
        <h2 id="daily-quiz-heading" className="sr-only">
          오늘의 퀴즈
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <SilhouetteQuizCardCntainer
            silhouetteQuiz={dailyQuiz.silhouetteQuiz}
          />
          {/* 특성 퀴즈 */}
          <article
            className="bg-white rounded-2xl p-6 shadow-lg"
            aria-labelledby="ability-quiz-title"
          >
            <h3
              id="ability-quiz-title"
              className="text-xl font-bold text-primary-4 mb-4 flex items-center gap-2"
            >
              <span className="text-2xl" aria-hidden="true">
                ✨
              </span>
              특성 퀴즈
            </h3>
            <p className="text-primary-2 mb-4 text-sm font-medium">
              {dailyQuiz.abilityQuiz.question}
            </p>
            <div className="mb-4 bg-gradient-to-br from-primary-1 to-primary-2 rounded-xl p-4">
              <p className="text-primary-4 text-sm leading-relaxed">
                {dailyQuiz.abilityQuiz.abilityDescription}
              </p>
            </div>
            <div
              className="space-y-2"
              role="group"
              aria-label="특성 퀴즈 답안 선택"
            >
              {/* {dailyQuiz.abilityQuiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect('ability', index)}
                  className={`w-full p-3 rounded-lg text-left text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-3 ${
                    selectedAnswers.ability === index
                      ? 'bg-primary-4 text-primary-1 shadow-md'
                      : 'bg-primary-1/10 text-primary-2 hover:bg-primary-1/20'
                  }`}
                  aria-pressed={selectedAnswers.ability === index}
                >
                  {option.koreanName}
                </button>
              ))} */}
            </div>
          </article>

          {/* 타입 퀴즈 */}
          <article
            className="bg-white rounded-2xl p-6 shadow-lg"
            aria-labelledby="type-quiz-title"
          >
            <h3
              id="type-quiz-title"
              className="text-xl font-bold text-primary-4 mb-4 flex items-center gap-2"
            >
              <span className="text-2xl" aria-hidden="true">
                🎯
              </span>
              타입 퀴즈
            </h3>
            <p className="text-primary-2 mb-4 text-sm font-medium">
              {dailyQuiz.typeQuiz.question}
            </p>
            <div className="mb-4 bg-gradient-to-br from-primary-1 to-primary-2 rounded-xl p-4 flex items-center justify-center">
              <span className="text-primary-4 text-lg font-bold">
                {dailyQuiz.typeQuiz.targetType} 타입
              </span>
            </div>
            <div
              className="space-y-2"
              role="group"
              aria-label="타입 퀴즈 답안 선택"
            >
              {/* {dailyQuiz.typeQuiz.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect('type', index)}
                  className={`w-full p-3 rounded-lg text-left text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-3 ${
                    selectedAnswers.type === index
                      ? 'bg-primary-4 text-primary-1 shadow-md'
                      : 'bg-primary-1/10 text-primary-2 hover:bg-primary-1/20'
                  }`}
                  aria-pressed={selectedAnswers.type === index}
                >
                  {option.koreanName}
                </button>
              ))} */}
            </div>
          </article>
        </div>
      </section>
    </Fragment>
  )
}

export default HomeQuizContaier
