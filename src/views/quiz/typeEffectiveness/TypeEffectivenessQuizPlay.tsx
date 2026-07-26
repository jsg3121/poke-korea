'use client'

import { Fragment, useState } from 'react'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import QuizHeaderComponent from '~/components/quiz/QuizHeader.component'
import QuizOptionButtonComponent from '~/components/quiz/QuizOptionButton.component'
import QuizSkipButtonComponent from '~/components/quiz/QuizSkipButton.component'
import TagComponent from '~/components/tag/Tag.component'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

/**
 * 타입 상성 퀴즈 QUIZ 단계 (반응형 단일). 문제 + "공격 → 방어" 타입칩 +
 * 4개 텍스트 옵션(배율). 타입칩은 신규 DS Tag로 교체. 옵션 그리드 모바일 1열/desktop 2×2.
 */
const TypeEffectivenessQuizPlay = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = useTypeEffectivenessQuizContext()

  const handleHideCounter = () => {
    setIsShowCounter(false)
    onStartCountdown()
  }
  useBodyScrollLock(isShowCounter)

  return (
    <Fragment>
      {isShowCounter && (
        <QuizCountDownModalComponents
          quizTitle="타입 상성 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <section className="w-full max-w-[1280px] mx-auto px-4 desktop:px-5 py-4 flex flex-col gap-4">
        <QuizHeaderComponent
          quizName="타입 상성 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-4 desktop:px-6 py-6 flex flex-col gap-6">
          <h2 className="text-xl desktop:text-2xl font-bold text-primary-1 text-center">
            {currentQuestion?.question}
          </h2>
          {currentQuestion && (
            <div className="flex flex-wrap items-center justify-center gap-2 py-6 border-y border-solid border-primary-3">
              <span className="text-base text-primary-1">공격:</span>
              <TagComponent
                type={currentQuestion.attackingType as PokemonType}
              />
              <span className="text-base text-primary-1">→</span>
              <span className="text-base text-primary-1">방어:</span>
              {currentQuestion.defendingTypes.map((type, index) => (
                <TagComponent key={index} type={type as PokemonType} />
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 desktop:gap-4">
            {currentQuestion?.options.map((option, index) => (
              <QuizOptionButtonComponent
                key={index}
                variant="text"
                optionNumber={index + 1}
                onClick={() => submitAnswer(index)}
              >
                {option}
              </QuizOptionButtonComponent>
            ))}
          </div>
          <QuizSkipButtonComponent onClickSkipButton={() => submitAnswer(99)} />
        </article>
      </section>
    </Fragment>
  )
}

export default TypeEffectivenessQuizPlay
