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
      <header className="w-full h-[8rem] pb-[1rem] pt-[1rem] border-b border-solid border-primary-4 mb-[2rem]">
        <h1 className="w-full h-[4rem] text-[2.5rem] leading-[4rem] font-bold text-center text-primary-4">
          {QUIZ_CONFIG[0].title}
        </h1>
        <p className="w-full h-[2rem] text-[1rem] leading-[2rem] text-center text-primary-3">
          {QUIZ_CONFIG[0].description}
        </p>
      </header>
      <article className="w-full min-h-[40rem] border-solid p-[5rem] rounded-[20px] bg-primary-4 flex items-center gap-x-[4rem]">
        <ImageComponent
          aria-hidden
          height="29rem"
          width="29rem"
          src="/assets/image/mask.webp"
        />
        <div className="w-[35rem] min-h-[26rem] h-full flex flex-col justify-between">
          <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-[1.25rem] [&>li]:leading-[3rem] [&>li]:text-primary-1">
            <li>1. 검은 실루엣으로 가려진 포켓몬을 맞춰보세요!</li>
            <li>2. 힌트를 통해 가려진 그림자를 약하게 만들 수 있어요.</li>
            <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
            <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
            <li>5. 문제 결과를 캡쳐하여 다른사람들에게 공유할 수 있어요.</li>
          </ul>
          <button
            className="h-[5rem] w-full bg-primary-2 rounded-[20px] text-[1.25rem] text-primary-4 hover:bg-primary-1 hover:scale-[1.025] transition-[transform] duration-[0.15s]"
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
