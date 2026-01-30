import Link from 'next/link'
import {
  QUIZ_ROUTES,
  QUIZ_SEO_CONTENT,
  QUIZ_CROSS_LINKS,
} from '~/constants/quiz.constants'

interface ResultFooterProps {
  onClickRetryButton: () => void
  quizType?: keyof typeof QUIZ_SEO_CONTENT
}

const ResultFooter = ({ onClickRetryButton, quizType }: ResultFooterProps) => {
  const handleClickRetryButton = () => {
    onClickRetryButton()
  }

  const seoContent = quizType ? QUIZ_SEO_CONTENT[quizType] : null
  const quizTypeKey =
    quizType === 'pokemonType'
      ? 'pokemon-type'
      : quizType === 'typeEffectiveness'
        ? 'type-effectiveness'
        : quizType

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-[1rem] justify-center">
        <button
          className="h-[3rem] text-aligned-xl px-[2rem] bg-primary-2 text-white font-medium rounded-lg"
          onClick={handleClickRetryButton}
        >
          다시 도전하기
        </button>
        <Link
          href={QUIZ_ROUTES.MAIN}
          className="h-[3rem] text-aligned-xl px-[2rem] bg-primary-3 text-black-2 font-medium rounded-lg"
        >
          다른 퀴즈 하러가기
        </Link>
      </div>
      {seoContent && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {seoContent.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-blue-600 hover:underline"
              >
                {link.text} →
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUIZ_CROSS_LINKS.filter((link) => link.type !== quizTypeKey).map(
              (link) => (
                <Link
                  key={link.type}
                  href={link.route}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {link.title} →
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultFooter
