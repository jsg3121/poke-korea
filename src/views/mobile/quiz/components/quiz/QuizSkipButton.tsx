interface QuizSkipButtonProps {
  onClickSkipButton: () => void
}

const QuizSkipButton = ({ onClickSkipButton }: QuizSkipButtonProps) => {
  const handleClickSkipAnswer = () => {
    onClickSkipButton()
  }

  return (
    <button
      onClick={handleClickSkipAnswer}
      className="col-span-2 mt-6 mx-auto block w-30 h-8 leading-[calc(2rem+2px)] text-primary-2 rounded-[1rem] hover:bg-primary-3 hover:text-primary-4 transition-colors"
    >
      건너뛰기
    </button>
  )
}

export default QuizSkipButton
