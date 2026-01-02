'use client'

import CorrectIcon from '~/assets/icons/correct-icon.svg'
import TagComponent from '~/components/Tag.component'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultFooter from '../../components/result/ResultFooter'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'
import DesktopTypeEffectivenessQuizResultTopBanner from '~/components/adSlot/DesktopTypeEffectivenessQuizResultTopBanner'

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
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <DesktopTypeEffectivenessQuizResultTopBanner />
      <article className="w-full h-fit bg-primary-4 rounded-[2rem] py-[1rem] px-[2rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-1 font-bold text-aligned-base text-[1.25rem]">
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
                <p className="w-full h-8 text-primary-1 mb-4 font-bold flex-items-gap-2 [&>svg]:w-5 [&>svg]:h-5">
                  #{index + 1}{' '}
                  {isCorrect && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </p>
                <div className="h-8 grid grid-cols-3 gap-3">
                  <p className="h-8 flex-items-gap-2">
                    <span className="h-full text-aligned-base text-[1rem] text-primary-1">
                      공격:
                    </span>
                    <TagComponent type={quiz.attackingType as PokemonType} />
                    <span className="h-full text-aligned-base text-[1.25rem] text-primary-1">
                      →
                    </span>
                    {quiz.defendingTypes.map((type, typeIndex) => (
                      <TagComponent
                        key={typeIndex}
                        type={type as PokemonType}
                      />
                    ))}
                  </p>
                  <p className="h-8 flex-items-gap-2">
                    <span className="h-full text-[1rem] text-aligned-base text-primary-1 font-bold">
                      정답:
                    </span>
                    <span className="h-full text-[1rem] text-aligned-base">
                      {correctAnswer}
                    </span>
                  </p>
                  <p className="h-8 flex-items-gap-2">
                    <span className="h-full text-[1rem] text-aligned-base text-primary-1 font-bold">
                      나의 답:
                    </span>
                    <span
                      className={`h-full text-[1rem] text-aligned-base font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
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
      <ResultFooter onClickRetryButton={handleClickRetryQuiz} />
    </section>
  )
}

export default TypeEffectivenessQuizResult
