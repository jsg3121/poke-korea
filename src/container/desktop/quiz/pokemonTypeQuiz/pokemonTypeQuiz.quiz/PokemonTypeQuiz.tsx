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
              <TagComponent type={currentQuestion?.targetType as PokemonType} />
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
                src={`${imageMode}/${option.id}.webp?w=180&h=180`}
                alt={`${option.koreanName} 포켓몬 선택`}
                className="drop-shadow-[1px_1px_2px_#333333]"
              />
              <p>{option.koreanName}</p>
            </button>
          ))}
          <QuizSkipButton onClickSkipButton={handleClickSkipAnswer} />
        </article>
      </section>
    </Fragment>
  )
}

export default PokemonTypeQuiz
