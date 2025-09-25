'use client'

import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'

const TypeEffectivenessQuizBeforeStage = () => {
  const { onChangeStage } = useTypeEffectivenessQuizContext()

  const handleChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <header className="w-full h-[8rem] pb-[1rem] pt-[1rem] border-b border-solid border-primary-4 mb-[2rem]">
        <h1 className="w-full h-[4rem] text-[2.5rem] leading-[4rem] font-bold text-center text-primary-4">
          {QUIZ_CONFIG[3].title}
        </h1>
        <p className="w-full h-[2rem] text-[1rem] leading-[2rem] text-center text-primary-3">
          {QUIZ_CONFIG[3].description}
        </p>
      </header>
      <article className="w-full border-solid p-[3rem] rounded-[20px] bg-primary-4 flex flex-col justify-between">
        <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-[1.25rem] [&>li]:leading-[3rem] [&>li]:text-primary-1 mb-[2rem]">
          <li>1. 공격 타입과 방어 타입을 보고 데미지 배수를 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 데미지 배수를 선택하세요.</li>
          <li>3. 단일 타입과 복합 타입 문제가 모두 나와요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <button
          className="h-[4rem] w-full bg-primary-2 rounded-[20px] text-[1.25rem] text-primary-4 hover:bg-primary-1 hover:scale-[1.025] transition-[transform] duration-[0.15s]"
          onClick={handleChangeStage}
        >
          시작하기
        </button>
      </article>
    </section>
  )
}

export default TypeEffectivenessQuizBeforeStage
