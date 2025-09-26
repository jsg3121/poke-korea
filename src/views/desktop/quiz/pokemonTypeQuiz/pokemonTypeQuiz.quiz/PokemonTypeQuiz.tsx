'use client'

import { Fragment, useState } from 'react'
import ImageComponent from '~/components/Image.component'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { imageMode } from '~/module/buildMode'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import QuizHeader from '../../components/QuizHeader'

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
      <section className="w-full max-w-[1280px] mx-auto h-[45rem] bg-primary-4 rounded-[2rem] mt-[2rem] relative flex flex-col">
        <QuizHeader
          quizName="포켓몬 타입 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="w-full  rounded-[2rem] p-[2rem] mx-auto grid grid-cols-2 gap-4">
          {currentQuestion?.targetType ? (
            <h2 className="w-full h-12 col-span-2 text-[1.75rem] text-primary-1 mb-4 text-center flex items-center justify-center gap-2">
              다음 중{' '}
              <span
                className={`chip-type-${currentQuestion.targetType.toLowerCase()} h-6 text-[1rem] leading-[calc(1.5rem+2px)] px-4 rounded-full block mb-1`}
              >
                {PokemonTypes[currentQuestion.targetType as PokemonType]}
              </span>
              타입을 가진 포켓몬은?
            </h2>
          ) : (
            <h2 className="w-full h-12 col-span-2 text-[1.75rem] text-primary-1 mb-4 text-center">
              {currentQuestion?.question}
            </h2>
          )}
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={handleClickSelectAnswer(index)}
              className="p-[1rem] text-left rounded-[1rem] bg-primary-3 flex flex-col items-center hover:bg-primary-2 transition-colors"
            >
              <ImageComponent
                width="8rem"
                height="8rem"
                src={`${imageMode}/${option.id}.webp`}
                alt={`${option.koreanName} 포켓몬 선택`}
                className="drop-shadow-[1px_1px_2px_#333333]"
              />
              <p>{option.koreanName}</p>
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

export default PokemonTypeQuiz
