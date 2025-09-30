import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import QuizHeader from '../../components/quiz/QuizHeader'
import SilhouetteQuizImage from './quiz.image/SilhouetteQuizImage'
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
      <section className="w-full max-w-[1280px] mx-auto h-[48rem] bg-primary-4 rounded-[2rem] mt-[2rem] relative flex flex-col justify-between">
        <QuizHeader
          quizName="실루엣 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <SilhouetteQuizImage
          key={currentQuestion?.correctPokemonId}
          pokemonId={currentQuestion?.correctPokemonId || 0}
        />
        <article className="w-full rounded-[2rem] p-[2rem] mx-auto grid grid-cols-2 gap-4">
          <h2 className="w-full text-[1.75rem] font-medium text-gray-800 mb-6 text-center col-span-2">
            {currentQuestion?.question}
          </h2>
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="group h-[3rem] px-[1rem] text-[1rem] text-left leading-[calc(3rem+2px)] rounded-[20rem] bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 transition-colors"
            >
              <span className="w-[1rem] leading-[calc(3rem+2px)] mr-[0.875rem] text-primary-1 font-bold group-hover:text-primary-4">
                {index + 1}
              </span>
              {option}
            </button>
          ))}
          <QuizSkipButton onClickSkipButton={handleClickSkipAnswer} />
        </article>
      </section>
    </Fragment>
  )
}

export default SilhouetteQuiz
