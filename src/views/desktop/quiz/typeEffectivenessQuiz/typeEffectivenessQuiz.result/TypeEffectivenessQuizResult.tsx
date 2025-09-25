'use client'

import Link from 'next/link'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { getQuizResultCopy } from '~/module/quiz.module'
import { PokemonTypes, TypesColor } from '~/types/pokemonTypes.types'
import { formatTime } from '~/utils/quiz.util'
import { getKoreanTypeName } from '~/module/typeEffectivenessQuiz.module'
import CorrectIcon from '~/assets/icons/correct-icon.svg'
import { PokemonType } from '~/graphql/typeGenerated'

const TypeEffectivenessQuizResult = () => {
  const { result, questions, onClickRetryQuiz } =
    useTypeEffectivenessQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  const getTypeColor = (typeName: string) => {
    const typeKey = Object.keys(PokemonTypes).find(
      (key) => PokemonTypes[key as keyof typeof PokemonTypes] === typeName,
    ) as keyof typeof TypesColor | undefined

    return typeKey ? TypesColor[typeKey] : '#A8A878'
  }

  if (!result) return null

  return (
    <section className="h-fit w-full max-w-[1280px] mx-auto pt-[3rem]">
      <header className="w-full h-[22rem]">
        <span className="w-fit h-[14rem] text-[10rem] block mx-auto">
          {medal}
        </span>
        <h1 className="w-full text-[2rem] font-bold text-center leading-[calc(2rem+2px)] text-primary-4">
          {headline}
        </h1>
        <p className="w-full h-[1.25rem] text-[1.25rem] text-center text-primary-3 leading-[calc(1.25rem+2px)] mt-[1.5rem]">
          {subcopy}
        </p>
      </header>
      <dl className="w-full h-[6.5rem] bg-primary-4 rounded-[2rem] p-[2rem] flex items-center justify-around mb-[2rem]">
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          맞은 문제
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {result.correctAnswers} 개
        </dd>
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          정답률
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {result.percentage} %
        </dd>
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          소요 시간
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {formatTime(result.totalTime)}
        </dd>
        <dt className="text-[1.25rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          평균 시간
        </dt>
        <dd className="text-[2.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1">
          {formatTime(result.averageTime)}
        </dd>
      </dl>
      <article className="w-full h-fit bg-primary-4 rounded-[2rem] py-[1rem] px-[2rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold leading-[calc(2rem+2px)] text-[1.25rem]">
          문제 정답
        </h2>
        <ul className="space-y-3">
          {questions.map((quiz, index) => {
            const userAnswerIndex = result.userAnswers[index]
            const userAnswer =
              userAnswerIndex !== 99
                ? quiz.options[userAnswerIndex]
                : '건너뛰기'
            const correctAnswer = quiz.options[quiz.correctAnswerIndex]
            const isCorrect = userAnswerIndex === quiz.correctAnswerIndex

            return (
              <li
                key={quiz.id}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      문제 {index + 1}
                    </span>
                    {isCorrect && (
                      <div className="w-5 h-5 text-green-500">
                        <CorrectIcon />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">공격:</span>
                    <span
                      className="px-2 py-1 rounded text-white text-xs"
                      style={{
                        backgroundColor: getTypeColor(
                          getKoreanTypeName(quiz.attackingType as PokemonType),
                        ),
                      }}
                    >
                      {getKoreanTypeName(quiz.attackingType as PokemonType)}
                    </span>
                    <span className="text-gray-400">→</span>
                    {quiz.defendingTypes.map((type, typeIndex) => (
                      <span
                        key={typeIndex}
                        className="px-2 py-1 rounded text-white text-xs"
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
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">정답:</span>
                    <span className="font-medium text-green-600">
                      {correctAnswer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">나의 답:</span>
                    <span
                      className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {userAnswer}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </article>
      <div className="flex gap-[1rem] justify-center">
        <button
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-2 text-white font-medium rounded-lg hover:bg-primary-4 hover:text-primary-1 transition-colors"
          onClick={handleClickRetryQuiz}
        >
          다시 도전하기
        </button>
        <Link
          href={QUIZ_ROUTES.MAIN}
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-3 text-black-2 font-medium rounded-lg hover:bg-primary-4 transition-colors"
        >
          다른 퀴즈 하러가기
        </Link>
      </div>
    </section>
  )
}

export default TypeEffectivenessQuizResult
