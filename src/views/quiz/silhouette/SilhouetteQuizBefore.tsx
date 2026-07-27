'use client'

import Link from 'next/link'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import GuideStartButtonComponent from '~/components/quiz/GuideStartButton.component'
import OtherQuizLinkComponent from '~/components/quiz/OtherQuizLink.component'
import {
  QUIZ_CONFIG,
  QUIZ_DESCRIPTION_LIST_DATA,
} from '~/constants/quiz.constants'
import { useSilhouetteQuizContext } from '~/context/SilhouetteQuiz.context'

/**
 * 실루엣 퀴즈 BEFORE 단계 (반응형 단일). 설명 3섹션 + 시작 버튼 + 관련 링크 +
 * 다른 퀴즈 링크. 기존 desktop/mobile 2벌을 통합했다. 구조는 유지하고 여백만 정리.
 */
const SilhouetteQuizBefore = () => {
  const { onChangeStage } = useSilhouetteQuizContext()
  const seoContent = QUIZ_DESCRIPTION_LIST_DATA.silhouette

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8 desktop:px-5">
      <PageHeaderComponent
        title={QUIZ_CONFIG[0].title}
        description={QUIZ_CONFIG[0].description}
      />
      <article className="w-full mt-6 p-5 desktop:p-6 rounded-[1rem] bg-primary-4">
        {seoContent.sections.map((section) => (
          <div key={section.content} className="mb-4 last:mb-0">
            {section.title !== '' && (
              <h3 className="text-lg desktop:text-xl font-bold text-primary-1 mb-2">
                {section.title}
              </h3>
            )}
            <p className="text-sm desktop:text-base text-primary-1 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
        <div className="mt-6">
          <GuideStartButtonComponent
            onClickStartButton={() => onChangeStage('QUIZ')}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-solid border-primary-3">
          {seoContent.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-touch items-center text-sm text-primary-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-2"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </article>
      <div className="mt-4">
        <OtherQuizLinkComponent currentQuiz="silhouette" />
      </div>
    </section>
  )
}

export default SilhouetteQuizBefore
