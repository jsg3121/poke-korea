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
      className="mt-6 mx-auto block px-4 py-2 text-gray-500 rounded-[1rem]"
    >
      건너뛰기
    </button>
  )
}

export default QuizSkipButton
