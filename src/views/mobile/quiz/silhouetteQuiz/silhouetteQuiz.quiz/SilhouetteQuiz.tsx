import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import SilhouetteQuizImage from '~/views/mobile/quiz/silhouetteQuiz/silhouetteQuiz.quiz/silhouetteQuiz.image/SilhouetteQuizImage'
import QuizHeader from '../../components/quiz/QuizHeader'
import QuizSkipButton from '../../components/quiz/QuizSkipButton'

const SilhouetteQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = useSilhouetteQuizContext()

  const handleClickSelectAnswer = (index: number) => () => {
    submitAnswer(index)
  }

  const handleClickSkipAnswer = () => {
    submitAnswer(99)
  }

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }
  useBodyScrollLock(isShowCounter)

  return (
    <Fragment>
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="실루엣 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <section className="w-full h-full px-[20px] py-[1rem] relative mx-auto flex flex-col gap-4">
        <QuizHeader
          quizName="실루엣 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-[1rem] flex flex-col gap-[1.5rem] py-[1.5rem]">
          <SilhouetteQuizImage
            key={currentQuestion?.correctPokemonId}
            pokemonId={currentQuestion?.correctPokemonId || 0}
          />
          <div className="flex flex-col gap-[1rem]">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={handleClickSelectAnswer(index)}
                className="btn-quiz-answer"
              >
                <span className="w-[1rem] text-aligned-xl mr-[0.875rem] text-primary-1 font-bold ">
                  {index + 1}
                </span>
                {option}
              </button>
            ))}
          </div>
          <QuizSkipButton onClickSkipButton={handleClickSkipAnswer} />
        </article>
      </section>
    </Fragment>
  )
}

export default SilhouetteQuiz
