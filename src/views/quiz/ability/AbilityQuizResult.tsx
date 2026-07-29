'use client'

import QuizResultTopBanner from '~/components/adSlot/QuizResultTopBanner'
import QuizResultCardComponent from '~/components/quiz/QuizResultCard.component'
import ResultFooterComponent from '~/components/quiz/ResultFooter.component'
import ResultHeaderComponent from '~/components/quiz/ResultHeader.component'
import ResultSummaryComponent from '~/components/quiz/ResultSummary.component'
import { QUIZ_RESULT_SLOTS } from '~/constants/adSense'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { getQuizResultCopy } from '~/module/quiz.module'

/**
 * 특성 퀴즈 RESULT 단계 (반응형 단일). 4종 공통 QuizResultCard(세로 카드)로 통일.
 * 본문 슬롯 = 특성 설명 문장. desktop 2열 그리드.
 */
const AbilityQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = useAbilityQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  if (!result) return null

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pt-4 pb-8 desktop:px-5">
      {/* 광고 — 결과 최상단(헤더 앞) */}
      <QuizResultTopBanner
        mobileSlot={QUIZ_RESULT_SLOTS.ability.mobile}
        desktopSlot={QUIZ_RESULT_SLOTS.ability.desktop}
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
            const isSkipped = result.userAnswers[index] === 99
            const userAnswer = isSkipped
              ? '건너뛰기'
              : quiz.options[result.userAnswers[index]].koreanName
            const realAnswer = quiz.options[quiz.correctAnswerIndex].koreanName
            const isCorrect = userAnswer === realAnswer

            return (
              <QuizResultCardComponent
                key={quiz.id}
                index={index + 1}
                isCorrect={isCorrect}
                typeLabel="특성"
                correctAnswer={realAnswer}
                userAnswer={userAnswer}
              >
                <p className="text-sm desktop:text-base text-primary-1 leading-relaxed">
                  {quiz.abilityDescription}
                </p>
              </QuizResultCardComponent>
            )
          })}
        </ul>
      </article>
      <ResultFooterComponent
        onClickRetryButton={onClickRetryQuiz}
        quizType="ability"
        relationPageHref="/ability"
        relationPageHrefLabel="특성 도감 확인하기"
      />
    </section>
  )
}

export default AbilityQuizResult
