import Link from 'next/link'
import { QUIZ_ROUTES } from '~/constants/quiz.constants'

interface ResultFooterProps {
  onClickRetryButton: () => void
}

const ResultFooter = ({ onClickRetryButton }: ResultFooterProps) => {
  const handleClickRetryButton = () => {
    onClickRetryButton()
  }

  return (
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
  )
}

export default ResultFooter
