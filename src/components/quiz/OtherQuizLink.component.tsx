import Link from 'next/link'
import { QUIZ_CROSS_LINKS } from '~/constants/quiz.constants'
import { QuizType } from '~/types/quiz.type'

/**
 * 다른 퀴즈 교차 링크 (BEFORE/RESULT 하단). 현재 퀴즈를 제외한 3개 퀴즈로 이동.
 * 기존 desktop("다른 퀴즈도 도전해보세요") / mobile("다른 퀴즈 하러 가기") 문구가
 * 달랐던 것을 desktop 카피로 통일한다. className은 반응형 단일로 병합.
 */
interface OtherQuizLinkProps {
  currentQuiz: QuizType
}

const OtherQuizLinkComponent = ({ currentQuiz }: OtherQuizLinkProps) => {
  return (
    <article className="w-full p-4 desktop:p-6 rounded-[1rem] bg-primary-4">
      <h3 className="text-lg desktop:text-xl font-bold text-primary-1 mb-3 desktop:mb-4">
        다른 퀴즈도 도전해보세요
      </h3>
      <ul className="space-y-2">
        {QUIZ_CROSS_LINKS.filter((link) => link.type !== currentQuiz).map(
          (link) => (
            <li key={link.type}>
              <Link
                href={link.route}
                className="inline-flex min-h-touch items-center text-base text-primary-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-2"
              >
                {link.title}
              </Link>
            </li>
          ),
        )}
      </ul>
    </article>
  )
}

export default OtherQuizLinkComponent
