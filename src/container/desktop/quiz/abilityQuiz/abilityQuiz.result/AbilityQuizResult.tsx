'use client'

import CorrectIcon from '~/assets/icons/correct-icon.svg'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultFooter from '../../components/result/ResultFooter'
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
    <section className="h-fit w-full max-w-[1280px] mx-auto pt-[3rem]">
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <article className="w-full h-fit bg-primary-4 rounded-[2rem] py-[1rem] px-[2rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold leading-[calc(2rem+2px)] text-[1.25rem]">
          문제 정답
        </h2>
        <ul className="space-y-3">
          {questions.map((quiz, index) => {
            const userAnswerIndex = result.userAnswers[index]
            const userAnswer =
              result.userAnswers[index] === 99
                ? '건너뛰기'
                : quiz.options[result.userAnswers[index]].koreanName
            const realAnswer = quiz.options[quiz.correctAnswerIndex].koreanName
            const isCorrect = userAnswerIndex === quiz.correctAnswerIndex

            return (
              <li
                key={quiz.id}
                className="w-full min-h-32 bg-white rounded-lg p-4 border border-gray-200"
              >
                <p className="w-full h-8 text-primary-1 font-bold flex items-center gap-2 [&>svg]:w-5 [&>svg]:h-5">
                  #{index + 1}{' '}
                  {isCorrect && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </p>
                <div className="w-full min-h-8 flex gap-4">
                  <p className="w-4/5 min-h-8 leading-[calc(2rem+2px)] text-left flex gap-1">
                    <span className="font-bold">특성 :</span>{' '}
                    {quiz.abilityDescription}
                  </p>
                  <div className="w-1/5">
                    <p className="h-8 text-[1rem] leading-[calc(2rem+2px)] shrink-0">
                      <span className="font-bold text-primary-1">정답 :</span>{' '}
                      {realAnswer}
                    </p>
                    <p
                      className={`h-8 text-[1rem] leading-[calc(2rem+2px)] shrink-0 ${realAnswer === userAnswer ? 'text-green-700 font-bold' : 'text-red-700'}`}
                    >
                      <span className="font-bold text-primary-1">
                        나의 답 :
                      </span>{' '}
                      {userAnswer}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </article>
      <ResultFooter onClickRetryButton={handleClickRetryQuiz} />
    </section>
  )
}

export default AbilityQuizResult
