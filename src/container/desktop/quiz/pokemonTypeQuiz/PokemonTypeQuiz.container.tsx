'use client'

import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { formatTimeShort } from '~/utils/quiz.util'

const PokemonTypeQuizContainer = () => {
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
  } = usePokemonTypeQuizContext()

  const handleClickSelectAnswer = (index: number) => () => {
    submitAnswer(index)
  }

  const handleClickSkipAnswer = () => {
    submitAnswer(99)
  }

  const formatPokemonTypes = (types: string[]) => {
    return types.join(' / ')
  }

  return (
    <section className="w-full h-full mx-auto flex flex-col justify-between">
      <header className="bg-white rounded-t-[2rem] shadow-md p-[1.5rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              포켓몬 타입 퀴즈
            </h1>
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

      <article className="flex-1 flex flex-col justify-center items-center px-[2rem]">
        <div className="w-full max-w-[800px] bg-white rounded-[2rem] shadow-md p-[2rem] mb-[2rem]">
          <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
            {currentQuestion?.question}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={handleClickSelectAnswer(index)}
                className="p-[1rem] text-left rounded-[1rem] border-2 border-gray-200 hover:border-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {option.koreanName}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatPokemonTypes(option.types)}
                    </div>
                  </div>
                  <span className="h-[2rem] w-[2rem] bg-gray-100 rounded-full text-center text-[0.875rem] leading-[calc(2rem+2px)]">
                    {index + 1}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleClickSkipAnswer}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              건너뛰기
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}

export default PokemonTypeQuizContainer
