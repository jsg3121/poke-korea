'use client'

import ImageComponent from '~/components/Image.component'
import QuizResultTopBanner from '~/components/adSlot/QuizResultTopBanner'
import QuizResultCardComponent from '~/components/quiz/QuizResultCard.component'
import ResultFooterComponent from '~/components/quiz/ResultFooter.component'
import ResultHeaderComponent from '~/components/quiz/ResultHeader.component'
import ResultSummaryComponent from '~/components/quiz/ResultSummary.component'
import TagComponent from '~/components/tag/Tag.component'
import { QUIZ_RESULT_SLOTS } from '~/constants/adSense'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'

/**
 * 포켓몬 타입 퀴즈 RESULT 단계 (반응형 단일). 기존 desktop 가로 스크롤 테이블을
 * 폐기하고 4종 공통 QuizResultCard(세로 카드)로 통일. desktop 2열 그리드.
 * 본문 슬롯 = 문제 타입칩 + 정답 포켓몬 이미지. 정답/나의 답에 포켓몬 이름을 병기한다
 * (기존 desktop 테이블은 오답 포켓몬을 이미지로만 보여줘 식별이 어려웠음 — UX-012).
 */
const PokemonTypeQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = usePokemonTypeQuizContext()

  const { headline, medal, subcopy } = getQuizResultCopy(result?.score || 0)

  if (!result) return null

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pt-4 pb-8 desktop:px-5">
      {/* 광고 — 결과 최상단(헤더 앞) */}
      <QuizResultTopBanner
        mobileSlot={QUIZ_RESULT_SLOTS.pokemonType.mobile}
        desktopSlot={QUIZ_RESULT_SLOTS.pokemonType.desktop}
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
            const correctOption = quiz.options[quiz.correctAnswerIndex]
            const userOption = isSkipped ? null : quiz.options[userAnswerIndex]
            const isCorrect = userAnswerIndex === quiz.correctAnswerIndex

            return (
              <QuizResultCardComponent
                key={quiz.id}
                index={index + 1}
                isCorrect={isCorrect}
                typeLabel="포켓몬 타입"
                correctAnswer={correctOption.koreanName}
                userAnswer={isSkipped ? '건너뛰기' : userOption?.koreanName}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-primary-2">문제 타입</span>
                    <TagComponent type={quiz.targetType as PokemonType} />
                  </div>
                  <div className="flex-1 flex justify-end">
                    <i className="block w-16 h-16">
                      <ImageComponent
                        width="4rem"
                        height="4rem"
                        src={`${imageMode}/${correctOption.id}`}
                        alt={`정답 포켓몬 ${correctOption.koreanName}`}
                        imageSize={{ width: 64, height: 64 }}
                        densities={[1, 1.5]}
                        sizes="4rem"
                        loading="lazy"
                      />
                    </i>
                  </div>
                </div>
              </QuizResultCardComponent>
            )
          })}
        </ul>
      </article>
      <ResultFooterComponent
        onClickRetryButton={onClickRetryQuiz}
        quizType="pokemon-type"
        relationPageHref="/list"
        relationPageHrefLabel="포켓몬 도감 확인하기"
      />
    </section>
  )
}

export default PokemonTypeQuizResult
