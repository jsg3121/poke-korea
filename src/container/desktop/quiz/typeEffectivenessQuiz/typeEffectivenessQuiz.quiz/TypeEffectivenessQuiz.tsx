'use client'
import { Fragment, useState } from 'react'
import DesktopAbilityQuizBottomBanner from '~/components/adSlot/DesktopAbilityQuizBottomBanner'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import TagComponent from '~/components/Tag.component'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import QuizHeader from '../../components/quiz/QuizHeader'
import QuizSkipButton from '../../components/quiz/QuizSkipButton'

const TypeEffectivenessQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = useTypeEffectivenessQuizContext()

  const handleClickSelectAnswer = (index: number) => () => {
    submitAnswer(index)
  }

  const handleClickSkipAnswer = () => {
    submitAnswer(99)
  }

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }
  useBodyScrollLock(isShowCounter)

  return (
    <Fragment>
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="타입 상성 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <section className="w-full max-w-[1280px] mx-auto h-[32rem] bg-primary-4 rounded-[2rem] mt-[2rem] relative flex flex-col">
        <QuizHeader
          quizName="타입 상성 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="w-full  rounded-[2rem] p-[2rem] mx-auto grid grid-cols-2 gap-4">
          <div className="w-full col-span-2 text-center">
            <h2 className="text-[1.75rem] text-primary-1 mb-4">
              {currentQuestion?.question}
            </h2>
            {currentQuestion && (
              <div className="flex-center gap-4 mb-6">
                <div className="flex-items-gap-2">
                  <span className="text-xl text-gray-600">공격:</span>
                  <TagComponent
                    type={currentQuestion.attackingType as PokemonType}
                  />
                </div>
                <span className="text-primary-1 text-2xl">→</span>
                <div className="flex-items-gap-2">
                  <span className="text-xl text-gray-600">방어:</span>
                  <div className="flex gap-1">
                    {currentQuestion.defendingTypes.map((type, index) => (
                      <TagComponent key={index} type={type as PokemonType} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="btn-quiz-answer group"
            >
              <span className="w-[1rem] text-aligned-xl mr-[0.875rem] text-primary-1 font-bold group-hover:text-primary-4">
                {index + 1}
              </span>
              {option}
            </button>
          ))}
          <QuizSkipButton onClickSkipButton={handleClickSkipAnswer} />
        </article>
      </section>
      <DesktopAbilityQuizBottomBanner />
    </Fragment>
  )
}

export default TypeEffectivenessQuiz
