import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import QuizHeader from '../../components/QuizHeader'

const AbilityQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = useAbilityQuizContext()

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
          quizTitle="특성 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <section className="w-full max-w-[1280px] mx-auto h-[33rem] bg-primary-4 rounded-[2rem] mt-[2rem] relative flex flex-col">
        <QuizHeader
          quizName="특성 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="w-full h-[25.5rem] rounded-[2rem] p-[2rem] mx-auto grid grid-cols-2 gap-4">
          <header className="col-span-2 mb-[2rem] p-[1.5rem] bg-primary-1 rounded-[1rem]">
            <p className="text-[1rem] text-primary-3 mb-[0.5rem]">설명</p>
            <h2 className="text-[1.125rem] leading-[1.6] text-primary-4">
              {currentQuestion?.abilityDescription}
            </h2>
          </header>
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="group h-[3rem] px-[1rem] text-[1rem] text-left leading-[calc(3rem+2px)] rounded-[20rem] bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 transition-colors"
            >
              <span className="w-[1rem] leading-[calc(3rem+2px)] mr-[0.875rem] text-primary-1 font-bold group-hover:text-primary-4">
                {index + 1}
              </span>
              {option.koreanName}
            </button>
          ))}
          <button
            onClick={handleClickSkipAnswer}
            className="col-span-2 mt-6 mx-auto block w-30 h-8 leading-[calc(2rem+2px)] text-primary-2 rounded-[1rem] hover:bg-primary-3 hover:text-primary-4 transition-colors"
          >
            건너뛰기
          </button>
        </article>
      </section>
    </Fragment>
  )
}

export default AbilityQuiz
