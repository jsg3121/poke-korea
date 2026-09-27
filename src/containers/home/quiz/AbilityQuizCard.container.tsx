'use client'

import { AbilityQuizQuestion } from '~/graphql/typeGenerated'
import QuizAnswerButton from '~/components/home/quiz/QuizAnswerButton.component'
import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import QuizCard from '~/components/quizCard/QuizCard.component'

import { useCorrectQuizCheck } from './hooks/useCorrectQuizCheck'

interface AbilityQuizCardProps {
  abilityQuiz: AbilityQuizQuestion
}

const AbilityQuizCard = ({ abilityQuiz }: AbilityQuizCardProps) => {
  const { isCorrect, isShowModal, handleSelectAnswer, handleCloseModal } =
    useCorrectQuizCheck({ correctAnswer: abilityQuiz.correctAnswerIndex })

  return (
    <>
      <QuizCard
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

export default AbilityQuizCard
