import Link from 'next/link'
import { QUIZ_CROSS_LINKS } from '~/constants/quiz.constants'
import { QuizType } from '~/types/quiz.type'

interface OtherQuizLinkProps {
  currentQuiz: QuizType
}

const OtherQuizLink = ({ currentQuiz }: OtherQuizLinkProps) => {
  return (
    <article className="w-full p-4 rounded-[1rem] bg-primary-4">
      <h3 className="text-xl font-bold text-primary-1 mb-3">
        다른 퀴즈 하러 가기
      </h3>
      <ul className="space-y-2">
        {QUIZ_CROSS_LINKS.filter((link) => link.type !== currentQuiz).map(
          (link) => (
            <li key={link.type}>
              <Link href={link.route} className="text-base text-primary-2">
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
