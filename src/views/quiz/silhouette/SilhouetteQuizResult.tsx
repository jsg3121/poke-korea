'use client'

import ImageComponent from '~/components/Image.component'
import QuizResultCardComponent from '~/components/quiz/QuizResultCard.component'
import ResultFooterComponent from '~/components/quiz/ResultFooter.component'
import ResultHeaderComponent from '~/components/quiz/ResultHeader.component'
import ResultSummaryComponent from '~/components/quiz/ResultSummary.component'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { imageMode } from '~/module/buildMode'
import { getQuizResultCopy } from '~/module/quiz.module'

/**
 * 실루엣 퀴즈 RESULT 단계 (반응형 단일). 기존 desktop 가로 스크롤 테이블을 폐기하고
 * 4종 공통 QuizResultCard(세로 카드)로 통일했다. desktop은 2열 그리드로 배치.
 */
const SilhouetteQuizResult = () => {
  const { result, questions, onClickRetryQuiz } = useSilhouetteQuizContext()

  const { headline, subcopy, medal } = getQuizResultCopy(result?.score ?? 0)

  if (!result) {
    return null
  }

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pt-4 pb-8 desktop:px-5">
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
              : quiz.options[result.userAnswers[index]]
            const realAnswer = quiz.options[quiz.correctAnswerIndex]
            const isCorrect = userAnswer === realAnswer

            return (
              <QuizResultCardComponent
                key={quiz.id}
                index={index + 1}
                isCorrect={isCorrect}
                typeLabel="실루엣"
                correctAnswer={realAnswer}
                userAnswer={userAnswer}
              >
                <div className="flex justify-center">
                  <i className="block w-24 h-24">
                    <ImageComponent
                      width="6rem"
                      height="6rem"
                      src={`${imageMode}/${quiz.correctPokemonId}`}
                      alt={`정답 포켓몬 ${realAnswer}`}
                      imageSize={{ width: 96, height: 96 }}
                      densities={[1, 1.5]}
                      sizes="6rem"
                      loading="lazy"
                    />
                  </i>
                </div>
              </QuizResultCardComponent>
            )
          })}
        </ul>
      </article>
      <ResultFooterComponent
        onClickRetryButton={onClickRetryQuiz}
        quizType="silhouette"
        relationPageHref="/list"
        relationPageHrefLabel="포켓몬 확인하러 가기"
      />
    </section>
  )
}

export default SilhouetteQuizResult
