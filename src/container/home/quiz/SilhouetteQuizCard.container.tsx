'use client'

import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import QuizAnswerButton from '~/components/home/quiz/QuizAnswerButton'
import ImageComponent from '~/components/Image.component'
import QuizCardComponent from '~/components/quizCard/QuizCard.component'
import { SilhouetteQuizQuestion } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { useCorrectQuizCheck } from './hooks/useCorrectQuizCheck'

interface SilhouetteQuizCardContainerProps {
  silhouetteQuiz: SilhouetteQuizQuestion
}

/**
 * 실루엣 퀴즈 카드 (QuizCard DS 셸 + 기존 퀴즈 로직 재사용).
 * 본문은 흑백(brightness-0) 포켓몬 이미지, 정답 체크는 useCorrectQuizCheck.
 */
const SilhouetteQuizCardContainer = ({
  silhouetteQuiz,
}: SilhouetteQuizCardContainerProps) => {
  const { isCorrect, isShowModal, handleSelectAnswer, handleCloseModal } =
    useCorrectQuizCheck({ correctAnswer: silhouetteQuiz.correctAnswerIndex })

  return (
    <>
      <QuizCardComponent
        icon="🔍"
        title="실루엣 퀴즈"
        description="이 실루엣은 어떤 포켓몬일까요?"
        headingId="silhouette-quiz-title"
        answersLabel="실루엣 퀴즈 답안 선택"
        body={
          <ImageComponent
            width="8rem"
            height="8rem"
            src={`${imageMode}/${silhouetteQuiz.correctPokemonId}`}
            alt="포켓몬 실루엣 이미지"
            imageSize={{ width: 128, height: 128 }}
            densities={[1, 1.5]}
            sizes="(min-width: 769px) 8rem, 6rem"
            loading="lazy"
            className="w-24 h-24 desktop:w-32 desktop:h-32 object-contain brightness-0"
          />
        }
        answers={silhouetteQuiz.options.map((option, index) => (
          <QuizAnswerButton
            key={`silhouette-quiz-id-${silhouetteQuiz.id}-${index}`}
            onClickAnswer={handleSelectAnswer}
            answerIndex={index}
            label={option}
          />
        ))}
      />
      {isShowModal && (
        <QuizResultPopup
          id="silhouette-quiz-portal"
          isCorrect={isCorrect}
          answer={silhouetteQuiz.options[silhouetteQuiz.correctAnswerIndex]}
          quizType="silhouette"
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default SilhouetteQuizCardContainer
