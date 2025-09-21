'use client'

import Link from 'next/link'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { getQuizResultCopy } from '~/module/quiz.module'
import { formatTime } from '~/utils/quiz.util'
import CorrectIcon from '~/assets/icons/correct-icon.svg'

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
            const userAnswer =
              quiz.options[result.userAnswers[index]].koreanName
            const realAnswer = quiz.options[quiz.correctAnswerIndex].koreanName

            return (
              <li
                key={quiz.id}
                className="w-full min-h-fit flex flex-col items-center bg-primary-4 rounded-[1rem] p-4"
              >
                <span className="w-full text-primary-1 font-bold flex items-center gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem]">
                  #{index + 1}{' '}
                  {userAnswer === realAnswer && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </span>
                <p className="w-full shrink-0 text-left text-[1.125rem] text-primary-1 py-2">
                  {quiz.abilityDescription}
                </p>
                <div className="w-full flex items-center justify-between mt-4">
                  <p className="w-fit text-left text-[1rem] text-primary-1">
                    정답 :{' '}
                    <span className="font-bold text-[1.125rem]">
                      {realAnswer}
                    </span>
                  </p>
                  <p
                    className={`w-fit shrink-0 text-left flex items-center gap-2 ${realAnswer === userAnswer ? 'text-primary-1 ' : ' text-primary-2'} [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem]`}
                  >
                    나의 답 :{' '}
                    <span
                      className={`${userAnswer === realAnswer ? 'font-bold' : ''}`}
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
