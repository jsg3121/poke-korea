import { PokemonTypeQuizQuestion } from '~/graphql/typeGenerated'
import { useCorrectQuizCheck } from '../hooks/useCorrectQuizCheck'
import { Fragment } from 'react'
import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import QuizAnswerButton from '../components/QuizAnswerButton'
import QuizCardHeader from '../components/QuizCardHeader'
import TagComponent from '~/components/Tag.component'

interface PokemonTypeQuizCardContainerProps {
  pokemonTypeQuiz: PokemonTypeQuizQuestion
}

const PokemonTypeQuizCardContainer = ({
  pokemonTypeQuiz,
}: PokemonTypeQuizCardContainerProps) => {
  const { isCorrect, isShowModal, handleSelectAnswer, handleCloseModal } =
    useCorrectQuizCheck({
      correctAnswer: pokemonTypeQuiz.correctAnswerIndex,
    })

  const handleClickAnswer = (selectAnswer: number) => {
    handleSelectAnswer(selectAnswer)
  }

  const handleClosePopup = () => {
    handleCloseModal()
  }

  return (
    <Fragment>
      <article
        className="bg-primary-4 rounded-2xl p-6 shadow-lg"
        aria-labelledby="type-quiz-title"
      >
        <QuizCardHeader
          quizName={
            <>
              <span className="text-2xl" aria-hidden="true">
                🎯
              </span>
              타입 퀴즈
            </>
          }
          quizDescription="주어진 타입의 포켓몬을 골라주세요!"
        />
        <div className="w-full h-40 mb-4 rounded-xl p-4 bg-white flex gap-2 items-center justify-center flex-wrap flex-col">
          <TagComponent type={pokemonTypeQuiz.targetType} />
          <p className="">타입을 가진 포켓몬은 누굴까요?</p>
        </div>
        <div
          className="space-y-2"
          role="group"
          aria-label="타입 퀴즈 답안 선택"
        >
          {pokemonTypeQuiz.options.map((option, index) => {
            return (
              <QuizAnswerButton
                key={`pokemon-type-quiz-id-${pokemonTypeQuiz.id}-${index}`}
                onClickAnswer={handleClickAnswer}
                answerIndex={index}
                label={option.koreanName}
              />
            )
          })}
        </div>
      </article>
      {isShowModal && (
        <QuizResultPopup
          id="ability-quiz-portal"
          isCorrect={isCorrect}
          answer={
            pokemonTypeQuiz.options[pokemonTypeQuiz.correctAnswerIndex]
              .koreanName
          }
          quizType="pokemon-type"
          onClose={handleClosePopup}
        />
      )}
    </Fragment>
  )
}

export default PokemonTypeQuizCardContainer
