import Link from 'next/link'
import { QUIZ_CROSS_LINKS } from '~/constants/quiz.constants'
import { QuizType } from '~/types/quiz.type'

interface OtherQuizLinkProps {
  currentQuiz: QuizType
}

const OtherQuizLink = ({ currentQuiz }: OtherQuizLinkProps) => {
  return (
    <article className="w-full mt-6 p-[3rem] rounded-[20px] bg-primary-4">
      <h3 className="text-lg font-bold text-primary-1 mb-4">
        다른 퀴즈도 도전해보세요
      </h3>
      <ul className="space-y-2">
        {QUIZ_CROSS_LINKS.filter((link) => link.type !== currentQuiz).map(
          (link) => (
            <li key={link.type}>
              <Link
                href={link.route}
                className="text-primary-2 hover:underline"
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
