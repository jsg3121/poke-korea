'use client'

import { Fragment, useState } from 'react'
import ImageComponent from '~/components/Image.component'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import QuizHeaderComponent from '~/components/quiz/QuizHeader.component'
import QuizOptionButtonComponent from '~/components/quiz/QuizOptionButton.component'
import QuizSkipButtonComponent from '~/components/quiz/QuizSkipButton.component'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { imageMode } from '~/module/buildMode'

/**
 * 실루엣 퀴즈 QUIZ 단계 (반응형 단일). 실루엣 이미지 + "이 포켓몬의 이름은?" +
 * 4개 텍스트 옵션. 옵션 그리드는 모바일 1열, desktop 2×2.
 * 기존 desktop/mobile 2벌을 통합했다.
 */
const SilhouetteQuizPlay = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = useSilhouetteQuizContext()

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
      <section className="w-full max-w-[1280px] mx-auto px-4 desktop:px-5 py-4 flex flex-col gap-4">
        <QuizHeaderComponent
          quizName="실루엣 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-4 desktop:px-6 py-6 flex flex-col gap-6">
          <div className="w-full flex justify-center">
            {/* wrapper가 반응형 크기를 잡고, figure는 100%, img는 h-full w-full로
                채운다. 모바일 8rem / 데스크톱 12rem으로 축소(정석 패턴). */}
            <div className="h-32 w-32 desktop:h-48 desktop:w-48">
              <ImageComponent
                key={currentQuestion?.correctPokemonId}
                height="100%"
                width="100%"
                src={`${imageMode}/${currentQuestion?.correctPokemonId || 0}`}
                alt="실루엣 포켓몬"
                imageSize={{ width: 192, height: 192 }}
                fetchPriority="high"
                className="!brightness-0 h-full w-full object-contain"
              />
            </div>
          </div>
          <h2 className="text-xl desktop:text-2xl font-bold text-primary-1 text-center">
            이 포켓몬의 이름은?
          </h2>
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

export default SilhouetteQuizPlay
