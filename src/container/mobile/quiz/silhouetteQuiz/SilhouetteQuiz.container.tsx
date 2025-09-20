'use client'

import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { formatTimeShort } from '~/utils/quiz.util'
import SilhouetteQuizImage from './silhouetteQuiz.image/SilhouetteQuizImage'

const SilhouetteQuizContainer = () => {
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
  } = useSilhouetteQuizContext()

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
              실루엣 퀴즈
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
      <article className="bg-white rounded-[1rem] shadow-md px-[1rem] flex flex-col gap-[1.5rem] pb-[1.5rem]">
        <SilhouetteQuizImage
          key={currentQuestion?.correctPokemonId}
          pokemonId={currentQuestion?.correctPokemonId || 0}
          onClickSkipAnswer={handleClickSkipAnswer}
        />
        <div className="grid grid-cols-2 gap-4 border-t border-solid border-primary-1 pt-[2rem]">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="h-[2.5rem] px-[1rem] text-[1rem] text-left leading-[calc(2.5rem+2px)] rounded-[20rem] bg-primary-3 text-white"
            >
              <span className="w-[1rem] leading-[calc(2.5rem+2px)] mr-[0.875rem] text-white font-bold">
                {index + 1}
              </span>
              {option}
            </button>
          ))}
        </div>
      </article>
    </section>
  )
}

export default SilhouetteQuizContainer
