'use client'

import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes, TypesColor } from '~/types/pokemonTypes.types'
import { formatTimeShort } from '~/utils/quiz.util'
import { getKoreanTypeName } from '~/module/typeEffectivenessQuiz.module'

const TypeEffectivenessQuizContainer = () => {
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
  } = useTypeEffectivenessQuizContext()

  const handleClickSelectAnswer = (index: number) => () => {
    submitAnswer(index)
  }

  const handleClickSkipAnswer = () => {
    submitAnswer(99)
  }

  const getTypeColor = (typeName: string) => {
    const typeKey = Object.keys(PokemonTypes).find(
      (key) => PokemonTypes[key as keyof typeof PokemonTypes] === typeName,
    ) as keyof typeof TypesColor | undefined

    return typeKey ? TypesColor[typeKey] : '#A8A878'
  }

  return (
    <section className="w-full h-full mx-auto flex flex-col gap-4">
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
      <article className="w-full max-w-[800px] bg-white rounded-[2rem] shadow-md p-[2rem] mb-[2rem] mx-auto">
        <div className="text-center mb-[2rem]">
          <h2 className="text-[1.25rem] font-bold text-gray-800 mb-4">
            {currentQuestion?.question}
          </h2>
          {currentQuestion && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">공격:</span>
                <span
                  className="px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{
                    backgroundColor: getTypeColor(
                      getKoreanTypeName(
                        currentQuestion.attackingType as PokemonType,
                      ),
                    ),
                  }}
                >
                  {getKoreanTypeName(
                    currentQuestion.attackingType as PokemonType,
                  )}
                </span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">방어:</span>
                <div className="flex gap-1">
                  {currentQuestion.defendingTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{
                        backgroundColor: getTypeColor(
                          getKoreanTypeName(type as PokemonType),
                        ),
                      }}
                    >
                      {getKoreanTypeName(type as PokemonType)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="p-[1.5rem] text-center rounded-[1rem] bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-200"
            >
              <span className="text-[1.1rem] font-medium text-gray-800">
                {option}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleClickSkipAnswer}
          className="mt-6 mx-auto block px-4 py-2 text-gray-500 rounded-[1rem] hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          건너뛰기
        </button>
      </article>
    </section>
  )
}

export default TypeEffectivenessQuizContainer
