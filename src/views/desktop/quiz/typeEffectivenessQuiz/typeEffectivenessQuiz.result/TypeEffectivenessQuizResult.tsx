'use client'

import Link from 'next/link'
import CorrectIcon from '~/assets/icons/correct-icon.svg'
import TagComponent from '~/components/Tag.component'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { getQuizResultCopy } from '~/module/quiz.module'
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
                className=" h-28 bg-white rounded-lg p-4 border border-gray-200"
              >
                <p className="w-full h-8 text-primary-1 mb-4 font-bold flex items-center gap-2 [&>svg]:w-5 [&>svg]:h-5">
                  #{index + 1}{' '}
                  {isCorrect && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </p>
                <div className="h-8 grid grid-cols-3 gap-3">
                  <p className="h-8 flex items-center gap-2">
                    <span className="h-full leading-[calc(2rem+2px)] text-[1rem] text-primary-1">
                      공격:
                    </span>
                    <TagComponent type={quiz.attackingType as PokemonType} />
                    <span className="h-full leading-[calc(2rem+2px)] text-[1.25rem] text-primary-1">
                      →
                    </span>
                    {quiz.defendingTypes.map((type, typeIndex) => (
                      <TagComponent
                        key={typeIndex}
                        type={type as PokemonType}
                      />
                    ))}
                  </p>
                  <p className="h-8 flex items-center gap-2">
                    <span className="h-full text-[1rem] leading-[calc(2rem+2px)] text-primary-1 font-bold">
                      정답:
                    </span>
                    <span className="h-full text-[1rem] leading-[calc(2rem+2px)]">
                      {correctAnswer}
                    </span>
                  </p>
                  <p className="h-8 flex items-center gap-2">
                    <span className="h-full text-[1rem] leading-[calc(2rem+2px)] text-primary-1 font-bold">
                      나의 답:
                    </span>
                    <span
                      className={`h-full text-[1rem] leading-[calc(2rem+2px)] font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
                    >
                      {userAnswer}
                    </span>
                  </p>
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
