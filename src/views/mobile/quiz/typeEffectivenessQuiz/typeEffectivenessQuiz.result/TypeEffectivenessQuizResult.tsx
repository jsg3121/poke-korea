'use client'

import Link from 'next/link'
import CorrectIcon from '~/assets/icons/correct-icon.svg'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { getQuizResultCopy } from '~/module/quiz.module'
import { getKoreanTypeName } from '~/module/typeEffectivenessQuiz.module'
import { formatTime } from '~/utils/quiz.util'

const TypeEffectivenessQuizResult = () => {
  const { result, questions, onClickRetryQuiz } =
    useTypeEffectivenessQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  if (!result) return null

  return (
    <section className="w-[calc(100%-40px)] mx-auto pt-[1rem]">
      <header className="w-full h-[15rem]">
        <span className="w-fit h-[9rem] text-[6rem] block mx-auto">
          {medal}
        </span>
        <h1 className="w-full text-[1.5rem] font-bold text-center leading-[calc(1.5rem+2px)] text-primary-4">
          {headline}
        </h1>
        <p className="w-full h-[1.25rem] text-[1rem] text-center text-primary-3 leading-[calc(1.25rem+2px)] mt-[1.5rem]">
          {subcopy}
        </p>
      </header>
      <dl className="w-full bg-primary-4 rounded-[2rem] p-[1rem] mb-[2rem] grid grid-cols-[20%_30%_20%_30%]">
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          맞은 문제
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {result.correctAnswers} 개
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          정답률
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {result.percentage} %
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          소요 시간
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {formatTime(result.totalTime)}
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          평균 시간
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-2">
          {formatTime(result.averageTime)}
        </dd>
      </dl>
      <article className="w-full h-fit py-[1rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-4 font-bold leading-[calc(2rem+2px)] text-[1.25rem] border-b border-solid border-primary-4 mb-4">
          정답
        </h2>
        <ul className="w-full flex flex-col gap-[1rem] items-center relative">
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
                className="w-full bg-primary-4 rounded-[1rem] p-4"
              >
                <span className="w-full h-6 text-[1.25rem] text-primary-1 font-bold flex items-center gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem] mb-3">
                  #{index + 1}{' '}
                  {isCorrect && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </span>
                <div className="w-full flex items-center justify-start gap-2 mt-3 mb-6">
                  <span className="h-6 text-[1rem] text-primary-1 leading-[calc(1.5rem+2px)]">
                    공격:
                  </span>
                  <span
                    className={`h-6 text-[1rem] text-primary-1 leading-[calc(1.5rem+2px)] rounded-full chip-type-${quiz.attackingType.toLowerCase()} px-4`}
                  >
                    {getKoreanTypeName(quiz.attackingType as PokemonType)}
                  </span>
                  <span className="h-6 text-[1rem] text-primary-1 leading-[calc(1.5rem+2px)]">
                    →
                  </span>
                  <span className="h-6 text-[1rem] text-primary-1 leading-[calc(1.5rem+2px)]">
                    방어:
                  </span>
                  {quiz.defendingTypes.map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className={`h-6 text-[1rem] text-primary-1 leading-[calc(1.5rem+2px)] rounded-full chip-type-${type.toLowerCase()} px-4`}
                    >
                      {getKoreanTypeName(type as PokemonType)}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 text-[1rem]">
                  <div className="flex flex-col gap-1">
                    <span className="text-primary-1 text-[1rem]">정답 :</span>
                    <span className="font-medium text-green-600 text-[1rem]">
                      {correctAnswer}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-primary-1 text-[1rem]">
                      나의 답 :
                    </span>
                    <span
                      className={`font-medium text-[1rem] ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
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
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-2 text-white font-medium rounded-lg"
          onClick={handleClickRetryQuiz}
        >
          다시 도전하기
        </button>
        <Link
          href={QUIZ_ROUTES.MAIN}
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-3 text-black-2 font-medium rounded-lg"
        >
          다른 퀴즈 하러가기
        </Link>
      </div>
    </section>
  )
}

export default TypeEffectivenessQuizResult
