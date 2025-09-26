'use client'

import ImageComponent from '~/components/Image.component'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { PokemonTypes } from '~/types/pokemonTypes.types'
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

  return (
    <section className="w-full h-full mx-auto flex flex-col gap-4">
      <header className="bg-white rounded-[1rem] shadow-md py-[1rem] px-[1rem] mb-[1rem]">
        <div className="flex items-center justify-between mb-[0.75rem]">
          <div>
            <h1 className="text-[1.25rem] font-bold text-gray-800">
              포켓몬 타입 퀴즈
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
      <article className="w-full max-w-[800px] bg-white rounded-[2rem] shadow-md p-[2rem] mb-[2rem] mx-auto">
        {currentQuestion?.targetType ? (
          <h2 className="w-full h-8 text-[1.25rem] text-primary-1 mb-4 text-center flex items-center justify-center gap-2">
            다음 중{' '}
            <span
              className={`chip-type-${currentQuestion.targetType.toLowerCase()} h-6 text-[1rem] leading-[calc(1.5rem+2px)] px-4 rounded-full block mb-1`}
            >
              {PokemonTypes[currentQuestion.targetType as PokemonType]}
            </span>
            타입을 가진 포켓몬은?
          </h2>
        ) : (
          <h2>{currentQuestion?.question}</h2>
        )}
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="p-[1rem] text-left rounded-[1rem] flex flex-col items-center"
            >
              <ImageComponent
                width="8rem"
                height="8rem"
                src={`${imageMode}/${option.id}.webp`}
                alt={`${option.koreanName} 포켓몬 선택`}
              />
              <p>{option.koreanName}</p>
            </button>
          ))}
        </div>
        <button
          onClick={handleClickSkipAnswer}
          className="mt-6 mx-auto block w-30 h-8 leading-[calc(2rem+2px)] text-primary-3 rounded-[1rem]"
        >
          건너뛰기
        </button>
      </article>
    </section>
  )
}

export default PokemonTypeQuizContainer
