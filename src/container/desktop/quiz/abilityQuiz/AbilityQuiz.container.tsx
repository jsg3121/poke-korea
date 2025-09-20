'use client'

import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { formatTimeShort } from '~/utils/quiz.util'

const AbilityQuizContainer = () => {
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
  } = useAbilityQuizContext()

  const handleClickSelectAnswer = (index: number) => () => {
    submitAnswer(index)
  }

  const handleClickSkipAnswer = () => {
    submitAnswer(99)
  }

  return (
    <section className="w-full h-full mx-auto flex flex-col justify-between">
      <header className="bg-white rounded-t-[2rem] shadow-md py-[1rem] px-[1.25rem] mb-[1.25rem]">
        <div className="flex items-center justify-between mb-[0.75rem]">
          <div>
            <h1 className="text-[1.5rem] font-bold text-gray-800">특성 퀴즈</h1>
            <p className="text-gray-600">
              문제 {currentQuestionIndex + 1} / 20
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-purple-600">
              {formatTimeShort(timeElapsed)}
            </div>
            <div className="text-sm text-gray-600">경과 시간</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>
      <article className="w-full rounded-[2rem] shadow-md py-[2rem] px-[2rem] mx-auto flex-1 flex flex-col justify-center">
        <h2 className="text-[1.25rem] font-medium text-primary-1 mb-[1.5rem] text-center">
          {currentQuestion?.question}
        </h2>
        <div className="mb-[2rem] p-[1.5rem] bg-primary-1 rounded-[1rem]">
          <h3 className="text-[1rem] text-primary-3 mb-[0.5rem]">설명</h3>
          <p className="text-[1.125rem] leading-[1.6] text-primary-4">
            {currentQuestion?.abilityDescription}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-[2rem]">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="h-[3rem] px-[1rem] text-[1rem] text-left leading-[calc(3rem+2px)] rounded-[20rem] bg-primary-3 text-white hover:bg-primary-2 transition-colors"
            >
              <span className="w-[1rem] leading-[calc(3rem+2px)] mr-[0.875rem] text-white font-bold">
                {index + 1}
              </span>
              {option.koreanName}
            </button>
          ))}
        </div>
        <button
          onClick={handleClickSkipAnswer}
          className="self-center px-[2rem] py-[0.5rem] text-[0.875rem] text-gray-500 border border-gray-300 rounded-[1rem] hover:bg-gray-50"
        >
          다음 문제
        </button>
      </article>
    </section>
  )
}

export default AbilityQuizContainer
