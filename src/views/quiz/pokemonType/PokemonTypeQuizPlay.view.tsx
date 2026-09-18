'use client'

import { Fragment, useState } from 'react'

import { PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/modules/buildMode.module'
import { useBodyScrollLock } from '~/hooks/useBodyScrollLock'
import { usePokemonTypeQuizContext } from '~/context/PokemonTypeQuiz.context'
import Image from '~/components/Image.component'
import QuizCountDownModalComponents from '~/components/quiz.modal/CountdownModal.component'
import QuizHeader from '~/components/quiz/QuizHeader.component'
import QuizOptionButton from '~/components/quiz/QuizOptionButton.component'
import QuizSkipButton from '~/components/quiz/QuizSkipButton.component'
import Tag from '~/components/tag/Tag.component'

/**
 * 포켓몬 타입 퀴즈 QUIZ 단계 (반응형 단일). "다음 중 [타입칩] 타입을 가진 포켓몬은?" +
 * 4개 포켓몬 이미지 옵션 카드. 옵션 그리드 모바일 1열/desktop 2×2.
 *
 * 기존 모바일 옵션 카드는 배경(bg-primary-3)이 누락돼 클릭 영역이 안 보이는
 * 버그가 있었으나, QuizOptionButton(variant="image")이 배경을 항상 부여한다.
 * 타입칩은 신규 DS Tag로 교체.
 */
const PokemonTypeQuizPlay = () => {
  const [isShowCounter, setIsShowCounter] = useState<boolean>(true)
  const {
    currentQuestionIndex,
    questions,
    timeElapsed,
    progress,
    currentQuestion,
    submitAnswer,
    onStartCountdown,
  } = usePokemonTypeQuizContext()

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
      <section className="w-full max-w-[1280px] mx-auto px-4 desktop:px-5 py-4 flex flex-col gap-4">
        <QuizHeader
          quizName="포켓몬 타입 퀴즈"
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progress={progress}
          timeElapsed={timeElapsed}
        />
        <article className="bg-white rounded-[1rem] shadow-md px-4 desktop:px-6 py-6 flex flex-col gap-6">
          <h2 className="flex flex-wrap items-center justify-center gap-2 text-xl desktop:text-2xl font-bold text-primary-1 text-center">
            {currentQuestion?.targetType ? (
              <>
                <span>다음 중</span>
                <Tag type={currentQuestion.targetType as PokemonType} />
                <span>타입을 가진 포켓몬은?</span>
              </>
            ) : (
              currentQuestion?.question
            )}
          </h2>
          <div className="grid grid-cols-2 gap-3 desktop:gap-4">
            {currentQuestion?.options.map((option, index) => (
              <QuizOptionButton
                key={index}
                variant="image"
                onClick={() => submitAnswer(index)}
              >
                {/* wrapper가 크기·그림자를 잡고, figure는 100%, img는
                    h-full w-full object-contain으로 채운다(상세 Hero 정석 패턴).
                    figure(width/height)와 img(imageSize)를 일치시켜 좌상단 쏠림 방지. */}
                <div className="h-24 w-24 desktop:h-32 desktop:w-32 shrink-0 drop-shadow-[1px_1px_2px_#333333]">
                  <Image
                    width="100%"
                    height="100%"
                    src={`${imageMode}/${option.id}`}
                    alt={`${option.koreanName} 포켓몬 선택`}
                    imageSize={{ width: 128, height: 128 }}
                    densities={[1, 1.5]}
                    sizes="8rem"
                    fetchPriority={index === 0 ? 'high' : undefined}
                    loading={index === 0 ? undefined : 'lazy'}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-sm desktop:text-base">{option.koreanName}</p>
              </QuizOptionButton>
            ))}
          </div>
          <QuizSkipButton onClickSkipButton={() => submitAnswer(99)} />
        </article>
      </section>
    </Fragment>
  )
}

export default PokemonTypeQuizPlay
