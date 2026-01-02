import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import QuizHeader from '../../components/quiz/QuizHeader'
import QuizSkipButton from '../../components/quiz/QuizSkipButton'

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
      <section className="w-full h-full px-[20px] py-[1rem] relative mx-auto flex flex-col gap-4">
        <QuizHeader
          quizName="특성 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-[1rem] flex flex-col gap-[1.5rem] py-[1.5rem]">
          <header className="my-[1.5rem] p-[1rem] bg-primary-1 rounded-[1rem]">
            <h2 className="text-[0.875rem] text-primary-3 mb-[0.5rem]">설명</h2>
            <p className="text-[1rem] leading-[1.6] text-primary-4">
              {currentQuestion?.abilityDescription}
            </p>
          </header>
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
                {option.koreanName}
              </button>
            ))}
          </div>
          <QuizSkipButton onClickSkipButton={handleClickSkipAnswer} />
        </article>
      </section>
    </Fragment>
  )
}

export default AbilityQuiz
