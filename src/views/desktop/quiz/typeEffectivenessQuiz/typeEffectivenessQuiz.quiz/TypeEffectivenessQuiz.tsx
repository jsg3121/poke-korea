'use client'
import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import QuizHeader from '../../components/QuizHeader'

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
                  <span
                    className={`chip-type-${currentQuestion.attackingType.toLowerCase()} h-6 text-[1rem] leading-[calc(1.5rem+2px)] px-4 rounded-full block mb-1`}
                  >
                    {PokemonTypes[currentQuestion.attackingType as PokemonType]}
                  </span>
                </div>
                <span className="text-primary-1 text-[1.5rem]">→</span>
                <div className="flex items-center gap-2">
                  <span className="text-[1.25rem] text-gray-600">방어:</span>
                  <div className="flex gap-1">
                    {currentQuestion.defendingTypes.map((type, index) => (
                      <span
                        key={index}
                        className={`chip-type-${type.toLowerCase()} h-6 text-[1rem] leading-[calc(1.5rem+2px)] px-4 rounded-full block mb-1`}
                      >
                        {PokemonTypes[type as PokemonType]}
                      </span>
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
          <button
            onClick={handleClickSkipAnswer}
            className="col-span-2 mt-6 mx-auto block w-30 h-8 leading-[calc(2rem+2px)] text-primary-2 rounded-[1rem] hover:bg-primary-3 hover:text-primary-4 transition-colors"
          >
            건너뛰기
          </button>
        </article>
      </section>
    </Fragment>
  )
}

export default TypeEffectivenessQuiz
