'use client'

import { Fragment } from 'react'
import ImageComponent from '~/components/Image.component'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'

const SilhouetteQuizBeforeStage = () => {
  const { onChangeStage } = useSilhouetteQuizContext()

  const handleChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <Fragment>
      <header className="w-full h-30 text-center border-b border-solid border-primary-4 pt-4 mb-[2rem]">
        <h1 className="h-16 text-[2rem] text-center leading-[4rem] text-primary-4 font-bold">
          {QUIZ_CONFIG[0].title}
        </h1>
        <p className="text-[0.875rem] text-primary-3 max-w-2xl mx-auto">
          {QUIZ_CONFIG[0].description}
        </p>
      </header>
      <article className="w-full p-[2rem] rounded-[20px] bg-primary-4 flex flex-col items-center">
        <ImageComponent
          aria-hidden
          height="14rem"
          width="14rem"
          src="/assets/image/mask.webp"
        />
        <div className="w-full h-full flex flex-col justify-between mt-[1rem]">
          <ul className="w-full mb-[3rem] [&>li]:h-[2rem] [&>li]:text-[0.925rem] [&>li]:leading-[1.5rem] [&>li]:text-primary-1">
            <li>1. 검은 실루엣으로 가려진 포켓몬을 맞춰보세요!</li>
            <li>2. 힌트를 통해 가려진 그림자를 약하게 만들 수 있어요.</li>
            <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
            <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
          </ul>
          <button
            className="h-[3rem] w-full bg-primary-2 rounded-[20px] text-[1.25rem] text-primary-4 hover:bg-primary-1 hover:scale-[1.025] transition-[transform] duration-[0.15s]"
            onClick={handleChangeStage}
          >
            시작하기
          </button>
        </div>
      </article>
    </Fragment>
  )
}

export default SilhouetteQuizBeforeStage
