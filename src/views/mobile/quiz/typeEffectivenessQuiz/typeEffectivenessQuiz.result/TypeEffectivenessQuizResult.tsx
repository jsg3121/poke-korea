'use client'

import CorrectIcon from '~/assets/icons/correct-icon.svg'
import TagComponent from '~/components/Tag.component'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { getQuizResultCopy } from '~/module/quiz.module'
import ResultFooter from '../../components/result/ResultFooter'
import ResultHeader from '../../components/result/ResultHeader'
import ResultSummary from '../../components/result/ResultSummary'
import MobileTypeEffectivenessQuizResultTopBanner from '~/components/adSlot/MobileTypeEffectivenessQuizResultTopBanner'

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
      <ResultHeader headline={headline} medal={medal} subcopy={subcopy} />
      <ResultSummary
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <MobileTypeEffectivenessQuizResultTopBanner />
      <article className="w-full h-fit py-[1rem] mb-[2rem]">
        <h2 className="w-full h-[3rem] text-primary-4 font-bold text-aligned-base text-[1.25rem] border-b border-solid border-primary-4 mb-4">
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
                <span className="w-full text-primary-1 font-bold flex-items-gap-2 [&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem] mb-4">
                  #{index + 1}{' '}
                  {userAnswer === correctAnswer && (
                    <>
                      정답! <CorrectIcon />
                    </>
                  )}
                </span>
                <div className="w-full flex items-center justify-start gap-2 mt-3 mb-6">
                  <span className="h-6 text-[1rem] text-primary-1 text-aligned-sm">
                    공격:
                  </span>
                  <TagComponent type={quiz.attackingType as PokemonType} />
                  <span className="h-6 text-[1.25rem] text-primary-1 text-aligned-sm">
                    →
                  </span>
                  <span className="h-6 text-[1rem] text-primary-1 text-aligned-sm">
                    방어:
                  </span>
                  {quiz.defendingTypes.map((type, typeIndex) => (
                    <TagComponent key={typeIndex} type={type as PokemonType} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 text-[1rem]">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-primary-1 text-[1rem]">정답</span>
                    <span className="font-medium text-green-700 text-[1rem]">
                      {correctAnswer}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-primary-1 text-[1rem]">나의 답</span>
                    <span
                      className={`font-medium text-[1rem] ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
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
      <ResultFooter onClickRetryButton={handleClickRetryQuiz} />
    </section>
  )
}

export default TypeEffectivenessQuizResult
