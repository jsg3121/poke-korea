'use client'

import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import QuizAnswerButton from '~/components/home/quiz/QuizAnswerButton'
import TagComponent from '~/components/tag/Tag.component'
import QuizCardComponent from '~/components/quizCard/QuizCard.component'
import { PokemonTypeQuizQuestion } from '~/graphql/typeGenerated'
import { useCorrectQuizCheck } from './hooks/useCorrectQuizCheck'

interface PokemonTypeQuizCardContainerProps {
  pokemonTypeQuiz: PokemonTypeQuizQuestion
}

/**
 * 타입 퀴즈 카드 (QuizCard DS 셸 + 기존 퀴즈 로직 재사용).
 * 본문은 타입 태그 + 안내 문구, 답안은 포켓몬 한글명.
 */
const PokemonTypeQuizCardContainer = ({
  pokemonTypeQuiz,
}: PokemonTypeQuizCardContainerProps) => {
  const { isCorrect, isShowModal, handleSelectAnswer, handleCloseModal } =
    useCorrectQuizCheck({ correctAnswer: pokemonTypeQuiz.correctAnswerIndex })

  return (
    <>
      <QuizCardComponent
        icon="🎯"
        title="타입 퀴즈"
        description="주어진 타입의 포켓몬을 골라주세요!"
        headingId="type-quiz-title"
        answersLabel="타입 퀴즈 답안 선택"
        body={
          <div className="flex flex-col flex-wrap items-center justify-center gap-2">
            <TagComponent type={pokemonTypeQuiz.targetType} />
            <p className="text-sm desktop:text-base text-primary-1">
              타입을 가진 포켓몬은 누굴까요?
            </p>
          </div>
        }
        answers={pokemonTypeQuiz.options.map((option, index) => (
          <QuizAnswerButton
            key={`pokemon-type-quiz-id-${pokemonTypeQuiz.id}-${index}`}
            onClickAnswer={handleSelectAnswer}
            answerIndex={index}
            label={option.koreanName}
          />
        ))}
      />
      {isShowModal && (
        <QuizResultPopup
          id="pokemon-type-quiz-portal"
          isCorrect={isCorrect}
          answer={
            pokemonTypeQuiz.options[pokemonTypeQuiz.correctAnswerIndex]
              .koreanName
          }
          quizType="pokemon-type"
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default PokemonTypeQuizCardContainer
