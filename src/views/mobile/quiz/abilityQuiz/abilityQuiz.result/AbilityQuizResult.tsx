'use client'

import CorrectIcon from '~/assets/icons/correct-icon.svg'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultFooter from '../../components/result/ResultFooter'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'
import MobileAbilityResultTopBanner from '~/components/adSlot/MobileAbilityResultTopBanner'

const AbilityQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = useAbilityQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  const handleClickRetryQuiz = () => {
    onClickRetryQuiz()
  }

  if (!result) return null

  return (
    <section className="w-full px-4 pt-[1rem]">
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <MobileAbilityResultTopBanner />
      <article className="w-full h-fit py-[1rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-4 font-bold text-aligned-base text-xl border-b border-solid border-primary-4 mb-4">
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
                <span className="w-full text-primary-1 font-bold flex-items-gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem]">
                  #{index + 1}{' '}
                  {userAnswer === realAnswer && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </span>
                <p className="w-full shrink-0 text-left text-lg text-primary-1 py-2">
                  {quiz.abilityDescription}
                </p>
                <div className="w-full flex-between mt-4">
                  <p className="w-fit text-left text-base text-primary-1">
                    정답 :{' '}
                    <span className="font-bold text-lg">{realAnswer}</span>
                  </p>
                  <p
                    className={`w-fit shrink-0 text-left flex-items-gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem]`}
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
      <ResultFooter
        onClickRetryButton={handleClickRetryQuiz}
        quizType="ability"
      />
    </section>
  )
}

export default AbilityQuizResult
