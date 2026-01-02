'use client'

import { Fragment, useState } from 'react'
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
      <section className="w-full h-full px-[20px] py-[1rem] relative mx-auto flex flex-col gap-4">
        <QuizHeader
          quizName="타입 상성 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-[1rem] flex flex-col py-[1.5rem]">
          <div className="text-center mb-[2rem]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {currentQuestion?.question}
            </h2>
            {currentQuestion && (
              <div className="h-120 flex-center gap-4 py-8 border-y border-solid border-primary-3">
                <p className="h-full flex-items-gap-2">
                  <span className="h-6 text-base text-primary-1 text-aligned-sm">
                    공격:
                  </span>
                  <TagComponent
                    type={currentQuestion.attackingType as PokemonType}
                  />
                </p>
                <span className="h-6 text-base text-primary-1 text-aligned-sm">
                  →
                </span>
                <p className="flex-items-gap-2">
                  <span className="text-base text-gray-600">방어:</span>
                  {currentQuestion.defendingTypes.map((type, index) => (
                    <TagComponent key={index} type={type as PokemonType} />
                  ))}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[1rem]">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={handleClickSelectAnswer(index)}
                className="btn-quiz-answer"
              >
                <span className="w-[1rem] text-aligned-xl mr-[0.875rem] text-primary-1 font-bold ">
                  {index + 1}
                </span>
                {option}
              </button>
            ))}
          </div>
          <QuizSkipButton onClickSkipButton={handleClickSkipAnswer} />
        </article>
      </section>
    </Fragment>
  )
}

export default TypeEffectivenessQuiz
