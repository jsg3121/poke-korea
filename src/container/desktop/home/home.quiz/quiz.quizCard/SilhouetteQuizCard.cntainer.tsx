'use client'

import { Fragment } from 'react'
import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import ImageComponent from '~/components/Image.component'
import { SilhouetteQuizQuestion } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { useCorrectQuizCheck } from '../hooks/useCorrectQuizCheck'
import QuizCardHeader from '../components/QuizCardHeader'
import QuizAnswerButton from '../components/QuizAnswerButton'

interface SilhouetteQuizCardCntainerProps {
  silhouetteQuiz: SilhouetteQuizQuestion
}

const SilhouetteQuizCardCntainer = ({
  silhouetteQuiz,
}: SilhouetteQuizCardCntainerProps) => {
  const { isCorrect, isShowModal, handleSelectAnswer, handleCloseModal } =
    useCorrectQuizCheck({
      correctAnswer: silhouetteQuiz.correctAnswerIndex,
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
        aria-labelledby="silhouette-quiz-title"
      >
        <QuizCardHeader
          quizName={
            <>
              <span className="text-[1.5rem]" aria-hidden="true">
                🔍
              </span>
              실루엣 퀴즈
            </>
          }
          quizDescription="이 실루엣은 어떤 포켓몬일까요?"
        />
        <div className="w-full h-40 mb-4 rounded-xl p-4 flex-center bg-white">
          <ImageComponent
            width="8rem"
            height="8rem"
            src={`${imageMode}/${silhouetteQuiz.correctPokemonId}.webp?w=180&h=180`}
            alt="포켓몬 실루엣 이미지"
            className="w-32 h-32 object-contain brightness-0"
          />
        </div>
        <div
          className="space-y-2"
          role="group"
          aria-label="실루엣 퀴즈 답안 선택"
        >
          {silhouetteQuiz.options.map((option, index) => {
            return (
              <QuizAnswerButton
                key={`silhouette-quiz-id-${silhouetteQuiz.id}-${index}`}
                onClickAnswer={handleClickAnswer}
                answerIndex={index}
                label={option}
              />
            )
          })}
        </div>
      </article>
      {isShowModal && (
        <QuizResultPopup
          id="silhouette-quiz-portal"
          isCorrect={isCorrect}
          answer={silhouetteQuiz.options[silhouetteQuiz.correctAnswerIndex]}
          quizType="silhouette"
          onClose={handleClosePopup}
        />
      )}
    </Fragment>
  )
}

export default SilhouetteQuizCardCntainer
