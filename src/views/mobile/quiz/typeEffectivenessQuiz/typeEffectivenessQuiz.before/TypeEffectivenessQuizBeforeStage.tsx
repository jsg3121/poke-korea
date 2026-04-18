'use client'

import Link from 'next/link'
import PageHeader from '~/components/mobile/PageHeader'
import {
  QUIZ_CONFIG,
  QUIZ_DESCRIPTION_LIST_DATA,
} from '~/constants/quiz.constants'
import { useTypeEffectivenessQuizContext } from '~/context/TypeEffectivenessQuiz.context'
import OtherQuizLink from '../../components/common/OtherQuizLink'
import GuideStartButton from '../../components/guide/GuideStartButton'

const TypeEffectivenessQuizBeforeStage = () => {
  const { onChangeStage } = useTypeEffectivenessQuizContext()
  const seoContent = QUIZ_DESCRIPTION_LIST_DATA.typeEffectiveness

  const handleClickStartButton = () => {
    onChangeStage('QUIZ')
  }

  return (
    <section className="h-full w-full px-4">
      <PageHeader
        title={QUIZ_CONFIG[3].title}
        description={QUIZ_CONFIG[3].description}
      />
      <section className="w-full mt-4 p-6 rounded-[1rem] bg-primary-4 mb-4">
        <h2 className="text-2xl font-bold text-primary-1 mb-3">
          타입 상성 퀴즈
        </h2>
        {seoContent.sections.map((section) => (
          <article key={section.title} className="mb-4 last:mb-0">
            {section.title !== '' && (
              <h3 className="text-xl font-bold text-primary-1 mb-2">
                {section.title}
              </h3>
            )}
            <p className="text-base text-primary-1 leading-6 mb-2">
              {section.content}
            </p>
          </article>
        ))}
        <GuideStartButton onClickStartButton={handleClickStartButton} />
        <div className="mt-4 pt-4 border-t border-gray-200">
          {seoContent.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-primary-2 hover:underline"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </section>
      <OtherQuizLink currentQuiz="type-effectiveness" />
    </section>
  )
}

export default TypeEffectivenessQuizBeforeStage
