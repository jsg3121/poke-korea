import Link from 'next/link'
import { QuizType } from '~/types/quiz.type'
import OtherQuizLink from '../common/OtherQuizLink'

interface ResultFooterProps {
  onClickRetryButton: () => void
  quizType: QuizType
  relationPageHref: string
  relationPageHrefLabel: string
}

const ResultFooter = ({
  onClickRetryButton,
  relationPageHref,
  relationPageHrefLabel,
  quizType,
}: ResultFooterProps) => {
  const handleClickRetryButton = () => {
    onClickRetryButton()
  }

  return (
    <div className="flex flex-col gap-6">
      <OtherQuizLink currentQuiz={quizType} />
      <div className="flex gap-[1rem] justify-center">
        <button
          className="h-[3rem] text-aligned-xl px-[2rem] bg-primary-2 text-white font-medium rounded-lg hover:bg-primary-4 hover:text-primary-1 transition-colors"
          onClick={handleClickRetryButton}
        >
          다시 도전하기
        </button>
        <Link
          href={relationPageHref}
          className="h-[3rem] text-aligned-xl px-[2rem] bg-primary-3 text-black-2 font-medium rounded-lg hover:bg-primary-4 transition-colors"
        >
          {relationPageHrefLabel}
        </Link>
      </div>
    </div>
  )
}

export default ResultFooter
