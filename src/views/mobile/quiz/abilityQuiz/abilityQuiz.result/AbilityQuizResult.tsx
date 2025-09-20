'use client'

import Link from 'next/link'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { getQuizResultCopy } from '~/module/quiz.module'
import { formatTime } from '~/utils/quiz.util'

const AbilityQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = useAbilityQuizContext()

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
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-[0.5rem]">
          {result.correctAnswers} 개
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          정답률
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-[0.5rem]">
          {result.percentage} %
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          소요 시간
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-[0.5rem]">
          {formatTime(result.totalTime)}
        </dd>
        <dt className="text-[1rem] font-[500] h-[2.5rem] leading-[calc(2.5rem+2px)] text-primary-1">
          평균 시간
        </dt>
        <dd className="text-[1.25rem] h-[2.5rem] leading-[calc(2.5rem+2px)] font-bold text-primary-1 text-right pr-[0.5rem]">
          {formatTime(result.averageTime)}
        </dd>
      </dl>
      <article className="w-full h-[25rem] bg-primary-4 rounded-[2rem] p-[1rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold leading-[calc(2rem+2px)] text-[1.25rem]">
          문제 정답
        </h2>
        <ul className="w-full h-[19.5rem] flex flex-wrap items-center overflow-y-auto relative [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl">
          <li className="w-[calc(100%-5px)] h-[4rem] text-[1rem] leading-[calc(2rem+2px)] text-primary-4 flex items-center flex-wrap sticky top-0">
            <p className="w-full h-[2rem] text-center bg-primary-1">설명</p>
            <p className="w-1/2 h-[2rem]shrink-0 text-center bg-primary-2 border-r border-solid border-primary-3">
              정답
            </p>
            <p className="w-1/2 h-[2rem]shrink-0 text-center bg-primary-2">
              나의 답
            </p>
          </li>
          {questions.map((quiz, index) => {
            const userAnswer =
              quiz.options[result.userAnswers[index]].koreanName
            const realAnswer = quiz.options[quiz.correctAnswerIndex].koreanName

            return (
              <li
                key={quiz.id}
                className="w-[calc(100%-5px)] min-h-fit flex flex-wrap items-center border-b border-solid"
              >
                <p className="w-full text-left border-b border-solid border-primary-3 py-[0.5rem]">
                  {quiz.abilityDescription}
                </p>
                <p className="w-1/2 shrink-0 text-center py-[0.5rem] border-r border-solid border-primary-3">
                  {realAnswer}
                </p>
                <p
                  className={`w-1/2 shrink-0 text-center py-[0.5rem] ${realAnswer === userAnswer ? 'font-bold' : ' text-primary-3'}`}
                >
                  {userAnswer}
                </p>
              </li>
            )
          })}
        </ul>
      </article>
      <div className="flex gap-[1rem] justify-center">
        <button
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-2 text-white font-medium rounded-lg transition-colors"
          onClick={handleClickRetryQuiz}
        >
          다시 도전하기
        </button>
        <Link
          href={QUIZ_ROUTES.MAIN}
          className="h-[3rem] leading-[calc(3rem+2px)] px-[2rem] bg-primary-3 text-black-2 font-medium rounded-lg transition-colors"
        >
          다른 퀴즈 하러가기
        </Link>
      </div>
    </section>
  )
}

export default AbilityQuizResult
