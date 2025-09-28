'use client'

import Link from 'next/link'
import CorrectIcon from '~/assets/icons/correct-icon.svg'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'

const AbilityQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = useAbilityQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  if (!result) return null

  return (
    <section className="w-[calc(100%-40px)] mx-auto pt-[1rem]">
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <article className="w-full h-fit py-[1rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-4 font-bold leading-[calc(2rem+2px)] text-[1.25rem] border-b border-solid border-primary-4 mb-4">
          정답
        </h2>
        <ul className="w-full flex flex-col gap-[1rem] items-center relative">
          {questions.map((quiz, index) => {
            const userAnswer =
              result.userAnswers[index] === 99
                ? '건너뛰기'
                : quiz.options[result.userAnswers[index]].koreanName
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
                    className={`w-fit shrink-0 text-left flex items-center gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem]`}
                  >
                    나의 답 :{' '}
                    <span
                      className={`${realAnswer === userAnswer ? 'text-green-700 font-bold' : 'text-red-700'}`}
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
