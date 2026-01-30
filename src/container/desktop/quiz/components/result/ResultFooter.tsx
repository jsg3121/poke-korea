import Link from 'next/link'
import {
  QUIZ_ROUTES,
  QUIZ_DESCRIPTION_LIST,
  QUIZ_CROSS_LINKS,
} from '~/constants/quiz.constants'

interface ResultFooterProps {
  onClickRetryButton: () => void
  quizType: keyof typeof QUIZ_DESCRIPTION_LIST
}

const ResultFooter = ({ onClickRetryButton, quizType }: ResultFooterProps) => {
  const handleClickRetryButton = () => {
    onClickRetryButton()
  }

  const descriptionData = QUIZ_DESCRIPTION_LIST[quizType]
  const quizTypeKey =
    quizType === 'pokemonType'
      ? 'pokemon-type'
      : quizType === 'typeEffectiveness'
        ? 'type-effectiveness'
        : quizType

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-[1rem] justify-center">
        <button
          className="h-[3rem] text-aligned-xl px-[2rem] bg-primary-2 text-white font-medium rounded-lg hover:bg-primary-4 hover:text-primary-1 transition-colors"
          onClick={handleClickRetryButton}
        >
          다시 도전하기
        </button>
        <Link
          href={QUIZ_ROUTES.MAIN}
          className="h-[3rem] text-aligned-xl px-[2rem] bg-primary-3 text-black-2 font-medium rounded-lg hover:bg-primary-4 transition-colors"
        >
          다른 퀴즈 하러가기
        </Link>
      </div>
      {descriptionData && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-wrap gap-3 justify-center">
            {descriptionData.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-blue-600 hover:underline"
              >
                {link.text} →
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {QUIZ_CROSS_LINKS.filter((link) => link.type !== quizTypeKey).map(
              (link) => (
                <Link
                  key={link.type}
                  href={link.route}
                  className="text-blue-600 hover:underline"
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
