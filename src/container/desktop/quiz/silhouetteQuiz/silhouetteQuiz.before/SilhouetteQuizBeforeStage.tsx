'use client'

import { QUIZ_CONFIG } from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'
import GuideHeader from '../../components/guide/GuideHeader'
import GuideStartButton from '../../components/guide/GuideStartButton'

const SilhouetteQuizBeforeStage = () => {
  const { onChangeStage } = useSilhouetteQuizContext()

  const handleClickChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <GuideHeader
        title={QUIZ_CONFIG[0].title}
        description={QUIZ_CONFIG[0].description}
      />
      <article className="w-full border-solid p-[3rem] rounded-[20px] bg-primary-4 flex flex-col justify-between">
        <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-[1.25rem] [&>li]:leading-[3rem] [&>li]:text-primary-1 mb-[2rem]">
          <li>1. 검은 실루엣으로 가려진 포켓몬을 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 포켓몬의 이름을 선택하세요.</li>
          <li>3. 너무 어렵다면 다음 문제로 넘어갈 수 있어요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickChangeStage} />
      </article>
    </section>
  )
}

export default SilhouetteQuizBeforeStage
