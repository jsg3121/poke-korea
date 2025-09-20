'use client'

import { Fragment } from 'react'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useAbilityQuizContext } from '~/context/AbilityQuiz.context'

const AbilityQuizBeforeStage = () => {
  const { onChangeStage } = useAbilityQuizContext()

  const handleChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <Fragment>
      <header className="w-full py-[1rem] border-b border-solid border-primary-4 mb-[2rem]">
        <h1 className="w-full text-[2rem] font-bold text-center text-primary-4 mb-[0.5rem]">
          {QUIZ_CONFIG[1].title}
        </h1>
        <p className="w-full text-[0.875rem] text-center text-primary-3">
          {QUIZ_CONFIG[1].description}
        </p>
      </header>
      <article className="w-full h-[20rem] p-[1.5rem] rounded-[20px] bg-primary-4 flex flex-col items-center justify-center gap-[2rem]">
        <div className="w-full">
          <ul className="w-full [&>li]:text-[1rem] [&>li]:leading-[1.8] [&>li]:text-primary-1 [&>li]:mb-[0.5rem]">
            <li>1. 특성 설명을 보고 어떤 특성인지 맞춰보세요!</li>
            <li>2. 4개의 선택지 중 정답을 골라보세요.</li>
            <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
            <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
          </ul>
        </div>
        <button
          className="w-full h-[3rem] bg-primary-2 rounded-[20px] text-[1.125rem] text-primary-4 hover:bg-primary-1 transition-colors"
          onClick={handleChangeStage}
        >
          시작하기
        </button>
      </article>
    </Fragment>
  )
}

export default AbilityQuizBeforeStage
