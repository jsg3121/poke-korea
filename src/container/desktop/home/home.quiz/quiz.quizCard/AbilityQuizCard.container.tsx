import { AbilityQuizQuestion } from '~/graphql/typeGenerated'
import { useCorrectQuizCheck } from '../hooks/useCorrectQuizCheck'
import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import QuizCardHeader from '../components/QuizCardHeader'
import QuizAnswerButton from '../components/QuizAnswerButton'

interface AbilityQuizCardContainerProps {
  abilityQuiz: AbilityQuizQuestion
}

const AbilityQuizCardContainer = ({
  abilityQuiz,
}: AbilityQuizCardContainerProps) => {
  const { isCorrect, isShowModal, handleSelectAnswer, handleCloseModal } =
    useCorrectQuizCheck({
      correctAnswer: abilityQuiz.correctAnswerIndex,
    })

  const handleClickAnswer = (selectAnswer: number) => {
    handleSelectAnswer(selectAnswer)
  }

  const handleClosePopup = () => {
    handleCloseModal()
  }

  return (
    <article
      className="bg-primary-4 rounded-2xl p-6 shadow-lg"
      aria-labelledby="ability-quiz-title"
    >
      <QuizCardHeader
        quizName={
          <>
            <span className="text-2xl" aria-hidden="true">
              ✨
            </span>
            특성 퀴즈
          </>
        }
        quizDescription={abilityQuiz.question}
      />
      <div className="w-full h-40 mb-4 rounded-xl p-4 bg-white flex justify-center items-center">
        <p className="text-primary-1 text-sm leading-relaxed">
          {abilityQuiz.abilityDescription}
        </p>
      </div>
      <div className="space-y-2" role="group" aria-label="특성 퀴즈 답안 선택">
        {abilityQuiz.options.map((option, index) => {
          return (
            <QuizAnswerButton
              key={`ability-quiz-id-${abilityQuiz.id}-${index}`}
              onClickAnswer={handleClickAnswer}
              answerIndex={index}
              label={option.koreanName}
            />
          )
        })}
      </div>
      {isShowModal && (
        <QuizResultPopup
          id="ability-quiz-portal"
          isCorrect={isCorrect}
          answer={
            abilityQuiz.options[abilityQuiz.correctAnswerIndex].koreanName
          }
          quizType="ability"
          onClose={handleClosePopup}
        />
      )}
    </article>
  )
}

export default AbilityQuizCardContainer
