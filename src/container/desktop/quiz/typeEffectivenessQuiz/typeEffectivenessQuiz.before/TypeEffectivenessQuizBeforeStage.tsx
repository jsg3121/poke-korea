'use client'

import Link from 'next/link'
import DesktopTypeEffectivenessQuizGuideBottomBanner from '~/components/adSlot/DesktopTypeEffectivenessQuizGuideBottomBanner'
import {
  QUIZ_CONFIG,
  QUIZ_SEO_CONTENT,
  QUIZ_CROSS_LINKS,
} from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import GuideStartButton from '../../components/guide/GuideStartButton'
import PageHeader from '~/components/PageHeader'

const TypeEffectivenessQuizBeforeStage = () => {
  const { onChangeStage } = useTypeEffectivenessQuizContext()
  const seoContent = QUIZ_SEO_CONTENT.typeEffectiveness

  const handleClickChangeStage = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full max-w-[1280px] mx-auto">
      <PageHeader
        title={QUIZ_CONFIG[3].title}
        description={QUIZ_CONFIG[3].description}
      />
      <article className="w-full border-solid p-[3rem] rounded-[20px] bg-primary-4 flex flex-col justify-between">
        <ul className="w-full h-[calc(100%-10rem)] [&>li]:h-[3rem] [&>li]:text-xl [&>li]:leading-[3rem] [&>li]:text-primary-1 mb-[2rem]">
          <li>1. 공격 타입과 방어 타입을 보고 데미지 배수를 맞춰보세요!</li>
          <li>2. 4개의 선택지 중 정확한 데미지 배수를 선택하세요.</li>
          <li>3. 단일 타입과 복합 타입 문제가 모두 나와요.</li>
          <li>4. 20문제를 완료한 후 결과를 확인하세요.</li>
        </ul>
        <GuideStartButton onClickStartButton={handleClickChangeStage} />
      </article>
      <article className="w-full mt-6 p-[3rem] rounded-[20px] bg-primary-4">
        {seoContent.sections.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <h3 className="text-lg font-bold text-primary-1 mb-2">
              {section.title}
            </h3>
            <p className="text-primary-1 leading-relaxed">{section.content}</p>
          </div>
        ))}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {seoContent.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-blue-600 hover:underline"
            >
              {link.text} →
            </Link>
          ))}
        </div>
      </article>
      <article className="w-full mt-6 p-[3rem] rounded-[20px] bg-primary-4">
        <h3 className="text-lg font-bold text-primary-1 mb-4">
          다른 퀴즈도 도전해보세요
        </h3>
        <ul className="space-y-2">
          {QUIZ_CROSS_LINKS.filter(
            (link) => link.type !== 'type-effectiveness',
          ).map((link) => (
            <li key={link.type}>
              <Link href={link.route} className="text-blue-600 hover:underline">
                {link.title} →
              </Link>
            </li>
          ))}
        </ul>
      </article>
      <DesktopTypeEffectivenessQuizGuideBottomBanner />
    </section>
  )
}

export default TypeEffectivenessQuizBeforeStage
