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
    <div className="flex flex-col gap-4">
      <OtherQuizLink currentQuiz={quizType} />
      <div className="w-full flex gap-[1rem] justify-center">
        <button
          className="w-2/5 h-[3rem] shrink-0 text-aligned-xl text-center bg-primary-2 text-white font-medium rounded-lg"
          onClick={handleClickRetryButton}
        >
          다시 도전하기
        </button>
        <Link
          href={relationPageHref}
          className="w-3/5 h-[3rem] text-aligned-xl text-center bg-primary-3 text-black-2 font-medium rounded-lg"
        >
          {relationPageHrefLabel}
        </Link>
      </div>
    </div>
  )
}

export default ResultFooter
