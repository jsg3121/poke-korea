'use client'

import { Fragment, useState } from 'react'
import ImageComponent from '~/components/Image.component'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import TagComponent from '~/components/Tag.component'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { imageMode } from '~/module/buildMode'
import QuizHeader from '../../components/quiz/QuizHeader'
import QuizSkipButton from '../../components/quiz/QuizSkipButton'

const PokemonTypeQuiz = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = usePokemonTypeQuizContext()

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
          quizTitle="포켓몬 타입 퀴즈!"
          onComplete={handleHideCounter}
        />
      )}
      <section className="w-full h-full px-[20px] py-[1rem] relative mx-auto flex flex-col gap-4">
        <QuizHeader
          quizName="포켓몬 타입 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-[1rem] flex flex-col py-[1.5rem]">
          <h2 className="w-full h-12 text-[1.375rem] text-aligned-xl text-primary-1 text-center flex-center gap-2 mb-4">
            {currentQuestion?.targetType ? (
              <>
                다음 중{' '}
                <TagComponent
                  type={currentQuestion.targetType as PokemonType}
                />
                타입을 가진 포켓몬은?
              </>
            ) : (
              currentQuestion?.question
            )}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={handleClickSelectAnswer(index)}
                className="p-[1rem] text-left rounded-[1rem] flex flex-col items-center"
              >
                <ImageComponent
                  width="8rem"
                  height="8rem"
                  src={`${imageMode}/${option.id}.webp?w=150&h=150`}
                  alt={`${option.koreanName} 포켓몬 선택`}
                  className="drop-shadow-[1px_1px_2px_#333333]"
                />
                <p className="text-base mt-3">{option.koreanName}</p>
              </button>
            ))}
          </div>
          <QuizSkipButton onClickSkipButton={handleClickSkipAnswer} />
        </article>
      </section>
    </Fragment>
  )
}

export default PokemonTypeQuiz
