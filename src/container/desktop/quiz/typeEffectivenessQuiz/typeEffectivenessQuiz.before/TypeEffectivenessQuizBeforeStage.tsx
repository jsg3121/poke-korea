'use client'

import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import GuideHeader from '../../components/guide/GuideHeader'
import GuideStartButton from '../../components/guide/GuideStartButton'

const TypeEffectivenessQuizBeforeStage = () => {
  const { onChangeStage } = useTypeEffectivenessQuizContext()

  const handleClickChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <GuideHeader
        title={QUIZ_CONFIG[3].title}
        description={QUIZ_CONFIG[3].description}
      />
      <article className="w-full border-solid p-[3rem] rounded-[20px] bg-primary-4 flex flex-col justify-between">
        <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-[1.25rem] [&>li]:leading-[3rem] [&>li]:text-primary-1 mb-[2rem]">
          <li>1. 공격 타입과 방어 타입을 보고 데미지 배수를 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 데미지 배수를 선택하세요.</li>
          <li>3. 단일 타입과 복합 타입 문제가 모두 나와요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickChangeStage} />
      </article>
    </section>
  )
}

export default TypeEffectivenessQuizBeforeStage
