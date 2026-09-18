'use client'

import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import QuizAnswerButton from '~/components/home/quiz/QuizAnswerButton'
import QuizCardComponent from '~/components/quizCard/QuizCard.component'
import { AbilityQuizQuestion } from '~/graphql/typeGenerated'
import { useCorrectQuizCheck } from './hooks/useCorrectQuizCheck'

interface AbilityQuizCardContainerProps {
  abilityQuiz: AbilityQuizQuestion
}

/**
 * 특성 퀴즈 카드 (QuizCard DS 셸 + 기존 퀴즈 로직 재사용).
 * 본문은 특성 설명 텍스트, 답안은 특성 한글명.
 */
const AbilityQuizCardContainer = ({
  abilityQuiz,
}: AbilityQuizCardContainerProps) => {
  const { isCorrect, isShowModal, handleSelectAnswer, handleCloseModal } =
    useCorrectQuizCheck({ correctAnswer: abilityQuiz.correctAnswerIndex })

  return (
    <>
      <QuizCardComponent
        icon="✨"
        title="특성 퀴즈"
        description={abilityQuiz.question}
        headingId="ability-quiz-title"
        answersLabel="특성 퀴즈 답안 선택"
        body={
          <p className="text-sm desktop:text-base leading-relaxed text-primary-1">
            {abilityQuiz.abilityDescription}
          </p>
        }
        answers={abilityQuiz.options.map((option, index) => (
          <QuizAnswerButton
            key={`ability-quiz-id-${abilityQuiz.id}-${index}`}
            onClickAnswer={handleSelectAnswer}
            answerIndex={index}
            label={option.koreanName}
          />
        ))}
      />
      {isShowModal && (
        <QuizResultPopup
          id="ability-quiz-portal"
          isCorrect={isCorrect}
          answer={
            abilityQuiz.options[abilityQuiz.correctAnswerIndex].koreanName
          }
          quizType="ability"
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default AbilityQuizCardContainer
