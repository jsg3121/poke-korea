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
      <header className="bg-white rounded-[1rem] shadow-md py-[1rem] px-[1rem] mb-[1rem]">
        <div className="flex items-center justify-between mb-[0.75rem]">
          <div>
            <h1 className="text-[1.25rem] font-bold text-gray-800">
              특성 퀴즈
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
      <article className="bg-white rounded-[1rem] shadow-md py-[1.5rem] px-[1rem] flex-1 flex flex-col">
        <div className="mb-[1.5rem] p-[1rem] bg-primary-1 rounded-[1rem]">
          <h2 className="text-[0.875rem] text-primary-3 mb-[0.5rem]">설명</h2>
          <p className="text-[1rem] leading-[1.6] text-primary-4">
            {currentQuestion?.abilityDescription}
          </p>
        </div>
        <div className="flex flex-col gap-[1rem] mb-[2rem]">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="h-[3rem] px-[1rem] text-[1rem] text-left leading-[calc(3rem+2px)] rounded-[20rem] bg-primary-3 text-primary-1 transition-colors"
            >
              <span className="w-[1rem] leading-[calc(3rem+2px)] mr-[0.875rem] text-primary-1 font-bold ">
                {index + 1}
              </span>
              {option.koreanName}
            </button>
          ))}
        </div>
        <button
          onClick={handleClickSkipAnswer}
          className="self-center px-[1.5rem] py-[0.5rem] text-[0.875rem] text-gray-500 border border-gray-300 rounded-[1rem]"
        >
          건너뛰기
        </button>
      </article>
    </section>
  )
}

export default AbilityQuizContainer
