'use client'

import QuizResultTopBanner from '~/components/adSlot/QuizResultTopBanner'
import QuizResultCardComponent from '~/components/quiz/QuizResultCard.component'
import ResultFooterComponent from '~/components/quiz/ResultFooter.component'
import ResultHeaderComponent from '~/components/quiz/ResultHeader.component'
import ResultSummaryComponent from '~/components/quiz/ResultSummary.component'
import TagComponent from '~/components/tag/Tag.component'
import { QUIZ_RESULT_SLOTS } from '~/constants/adSense'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { getQuizResultCopy } from '~/module/quiz.module'

/**
 * 타입 상성 퀴즈 RESULT 단계 (반응형 단일). 4종 공통 QuizResultCard(세로 카드)로 통일.
 * 본문 슬롯 = 공격 → 방어 타입칩(신규 DS Tag). desktop 2열 그리드.
 */
const TypeEffectivenessQuizResult = () => {
  const { result, questions, onClickRetryQuiz } =
    useTypeEffectivenessQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  if (!result) return null

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pt-4 pb-8 desktop:px-5">
      {/* 광고 — 결과 최상단(헤더 앞) */}
      <QuizResultTopBanner
        mobileSlot={QUIZ_RESULT_SLOTS.typeEffectiveness.mobile}
        desktopSlot={QUIZ_RESULT_SLOTS.typeEffectiveness.desktop}
      />
      <ResultHeaderComponent
        headline={headline}
        medal={medal}
        subcopy={subcopy}
      />
      <ResultSummaryComponent
        averageTime={result.averageTime}
        correctAnswers={result.correctAnswers}
        percentage={result.percentage}
        totalTime={result.totalTime}
      />
      <article className="w-full py-4">
        <h2 className="text-xl font-bold text-primary-4 pb-2 border-b border-solid border-primary-3 mb-4">
          문제 정답
        </h2>
        <ul className="w-full grid grid-cols-1 desktop:grid-cols-2 gap-4">
          {questions.map((quiz, index) => {
            const userAnswerIndex = result.userAnswers[index]
            const isSkipped = userAnswerIndex === 99
            const userAnswer = isSkipped
              ? '건너뛰기'
              : quiz.options[userAnswerIndex]
            const realAnswer = quiz.options[quiz.correctAnswerIndex]
            const isCorrect = userAnswerIndex === quiz.correctAnswerIndex

            return (
              <QuizResultCardComponent
                key={quiz.id}
                index={index + 1}
                isCorrect={isCorrect}
                typeLabel="타입 상성"
                correctAnswer={realAnswer}
                userAnswer={userAnswer}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-primary-2">공격:</span>
                  <TagComponent type={quiz.attackingType as PokemonType} />
                  <span className="text-sm text-primary-1">→</span>
                  <span className="text-sm text-primary-2">방어:</span>
                  {quiz.defendingTypes.map((type, typeIndex) => (
                    <TagComponent key={typeIndex} type={type as PokemonType} />
                  ))}
                </div>
              </QuizResultCardComponent>
            )
          })}
        </ul>
      </article>
      <ResultFooterComponent
        onClickRetryButton={onClickRetryQuiz}
        quizType="type-effectiveness"
        relationPageHref="/type-effectiveness"
        relationPageHrefLabel="타입 상성 계산 하러 가기"
      />
    </section>
  )
}

export default TypeEffectivenessQuizResult
