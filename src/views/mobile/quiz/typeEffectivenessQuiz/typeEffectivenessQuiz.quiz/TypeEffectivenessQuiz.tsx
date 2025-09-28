'use client'

import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import TagComponent from '~/components/Tag.component'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { formatTimeShort } from '~/utils/quiz.util'

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
        <header className="bg-white rounded-[1rem] shadow-md py-[1rem] px-[1rem] mb-[1rem]">
          <div className="flex items-center justify-between mb-[0.75rem]">
            <div>
              <h1 className="text-[1.25rem] font-bold text-gray-800">
                타입 상성 퀴즈
              </h1>
              <p className="text-[0.875rem] text-gray-600">
                문제 {currentQuestionIndex + 1} / 20
              </p>
            </div>
            <div className="text-right">
              <div className="text-[1rem] font-medium text-purple-600">
                {formatTimeShort(timeElapsed)}
              </div>
              <div className="text-[0.75rem] text-gray-600">경과 시간</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>
        <article className="w-full bg-white rounded-[2rem] shadow-md py-[2rem] px-[1rem] mb-[2rem] mx-auto">
          <div className="text-center mb-[2rem]">
            <h2 className="text-[1.25rem] font-bold text-gray-800 mb-4">
              {currentQuestion?.question}
            </h2>
            {currentQuestion && (
              <div className="h-120 flex items-center justify-center gap-4 py-8 mb-6 border-y border-solid border-primary-3">
                <p className="h-full flex items-center gap-2">
                  <span className="h-6 text-[1rem] text-primary-1 leading-[calc(1.5rem+2px)]">
                    공격:
                  </span>
                  <TagComponent
                    type={currentQuestion.attackingType as PokemonType}
                  />
                </p>
                <span className="h-6 text-[1rem] text-primary-1 leading-[calc(1.5rem+2px)]">
                  →
                </span>
                <p className="flex items-center gap-2">
                  <span className="text-[1rem] text-gray-600">방어:</span>
                  {currentQuestion.defendingTypes.map((type, index) => (
                    <TagComponent key={index} type={type as PokemonType} />
                  ))}
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={handleClickSelectAnswer(index)}
                className="p-[1.5rem] text-center rounded-[1rem] bg-primary-2"
              >
                <span className="text-[1.1rem] font-medium text-primary-4">
                  {option}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={handleClickSkipAnswer}
            className="mt-6 mx-auto block px-4 py-2 text-gray-500 rounded-[1rem]"
          >
            건너뛰기
          </button>
        </article>
      </section>
    </Fragment>
  )
}

export default TypeEffectivenessQuiz
