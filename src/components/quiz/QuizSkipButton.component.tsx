interface QuizSkipButtonProps {
  onClickSkipButton: () => void
}

const QuizSkipButton = ({ onClickSkipButton }: QuizSkipButtonProps) => {
  return (
    <button
      type="button"
      className="mt-6 mobile:mt-0 mx-auto flex items-center justify-center min-h-touch px-4 text-base text-primary-2 rounded-[1rem] hover:bg-primary-3 hover:text-primary-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-2 transition-colors"
      onClick={onClickSkipButton}
    >
      건너뛰기
    </button>
  )
}

export default QuizSkipButton
