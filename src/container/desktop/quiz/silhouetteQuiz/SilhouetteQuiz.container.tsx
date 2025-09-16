'use client'

import ImageComponent from '~/components/Image.component'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { imageMode } from '~/module/buildMode'
import { formatTimeShort } from '~/utils/quiz.util'

const SilhouetteQuizContainer = () => {
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
  } = useSilhouetteQuizContext()

  const handleClickSelectAnswer = (index: number) => () => {
    return submitAnswer(index)
  }

  return (
    <section className="w-full h-full mx-auto flex flex-col justify-between">
      <header className="bg-white rounded-t-[2rem] shadow-md p-[1.5rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">실루엣 퀴즈</h1>
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
      <div className="mx-auto">
        <ImageComponent
          height="18rem"
          width="18rem"
          src={`${imageMode}/${currentQuestion?.correctPokemonId}.webp`}
          alt="실루엣 포켓몬"
          className="brightness-0 saturate-100"
        />
      </div>
      <article className="w-1/2 bg-white rounded-[2rem] shadow-md p-[2rem] mb-[2rem] mx-auto">
        <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
          {currentQuestion?.question}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="h-[4rem] px-[1rem] text-[1rem] text-left leading-[calc(4rem+2px)] rounded-[20rem] flex items-center hover:bg-primary-3 transition-all duration-200 font-medium"
            >
              <span className="h-[2rem] w-[2rem] bg-gray-100 rounded-full text-center text-[0.875rem] leading-[calc(2rem+2px)] mr-[0.75rem]">
                {String.fromCharCode(65 + index)}
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
