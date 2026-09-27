import Link from 'next/link'

import { QuizType } from '~/types/quiz.type'
import { QUIZ_CROSS_LINKS } from '~/constants/quiz.constants'

interface OtherQuizLinkProps {
  currentQuiz: QuizType
}

const OtherQuizLink = ({ currentQuiz }: OtherQuizLinkProps) => {
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

export default OtherQuizLink
