import { SilhouetteQuizQuestion } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { useCorrectQuizCheck } from '../hooks/useCorrectQuizCheck'
import { Fragment } from 'react'
import QuizResultPopup from '~/components/home/QuizResultPopup.component'
import ImageComponent from '~/components/Image.component'

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

  const handleClickAnswer = (selectAnswer: number) => () => {
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
        <h3
          id="silhouette-quiz-title"
          className="text-[1.5rem] font-bold text-primary-1 mb-4 flex items-center gap-2"
        >
          <span className="text-[1.5rem]" aria-hidden="true">
            🔍
          </span>
          실루엣 퀴즈
        </h3>
        <p className="text-primary-1 mb-4 text-[1rem] font-medium">
          이 실루엣은 어떤 포켓몬일까요?
        </p>
        <div className="mb-4 rounded-xl p-4 flex items-center justify-center">
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
          {silhouetteQuiz.options.map((option, index) => (
            <button
              key={`silhouette-quiz-id-${silhouetteQuiz.id}-${index}`}
              onClick={handleClickAnswer(index)}
              className={`w-full h-12 px-4 leading-[calc(3rem+2px)] rounded-lg text-left text-primary-1 font-medium bg-primary-3 hover:bg-primary-1 hover:text-primary-4 transition-colors duration-200`}
            >
              {option}
            </button>
          ))}
        </div>
      </article>
      {isShowModal && (
        <QuizResultPopup isCorrect={isCorrect} onClose={handleClosePopup} />
      )}
    </Fragment>
  )
}

export default SilhouetteQuizCardCntainer
