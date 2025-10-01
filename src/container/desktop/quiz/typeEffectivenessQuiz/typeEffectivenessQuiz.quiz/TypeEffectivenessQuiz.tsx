'use client'
import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import TagComponent from '~/components/Tag.component'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import QuizHeader from '../../components/quiz/QuizHeader'
import QuizSkipButton from '../../components/quiz/QuizSkipButton'
import DesktopAbilityQuizBottomBanner from '~/components/adSlot/DesktopAbilityQuizBottomBanner'

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
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[1.25rem] text-gray-600">공격:</span>
                  <TagComponent
                    type={currentQuestion.attackingType as PokemonType}
                  />
                </div>
                <span className="text-primary-1 text-[1.5rem]">→</span>
                <div className="flex items-center gap-2">
                  <span className="text-[1.25rem] text-gray-600">방어:</span>
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
              className="group h-[3rem] px-[1rem] text-[1rem] text-left leading-[calc(3rem+2px)] rounded-[20rem] bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 transition-colors"
            >
              <span className="w-[1rem] leading-[calc(3rem+2px)] mr-[0.875rem] text-primary-1 font-bold group-hover:text-primary-4">
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
