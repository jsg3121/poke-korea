'use client'

import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import QuizHeaderComponent from '~/components/quiz/QuizHeader.component'
import QuizOptionButtonComponent from '~/components/quiz/QuizOptionButton.component'
import QuizSkipButtonComponent from '~/components/quiz/QuizSkipButton.component'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

/**
 * 특성 퀴즈 QUIZ 단계 (반응형 단일). 특성 설명 카드 + 4개 텍스트 옵션(특성명).
 * 옵션 그리드는 모바일 1열, desktop 2×2.
 */
const AbilityQuizPlay = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = useAbilityQuizContext()

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
      <section className="w-full max-w-[1280px] mx-auto px-4 desktop:px-5 py-4 flex flex-col gap-4">
        <QuizHeaderComponent
          quizName="특성 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-4 desktop:px-6 py-6 flex flex-col gap-6">
          <header className="p-4 bg-primary-1 rounded-[1rem]">
            <h2 className="text-sm text-primary-3 mb-2">설명</h2>
            <p className="text-base leading-relaxed text-primary-4">
              {currentQuestion?.abilityDescription}
            </p>
          </header>
          <div className="grid grid-cols-2 gap-3 desktop:gap-4">
            {currentQuestion?.options.map((option, index) => (
              <QuizOptionButtonComponent
                key={index}
                variant="text"
                optionNumber={index + 1}
                onClick={() => submitAnswer(index)}
              >
                {option.koreanName}
              </QuizOptionButtonComponent>
            ))}
          </div>
          <QuizSkipButtonComponent onClickSkipButton={() => submitAnswer(99)} />
        </article>
      </section>
    </Fragment>
  )
}

export default AbilityQuizPlay
