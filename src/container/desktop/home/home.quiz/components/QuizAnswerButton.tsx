interface QuizAnswerButtonProps {
  answerIndex: number
  label: string
  onClickAnswer: (answerIndex: number) => void
}

const QuizAnswerButton = ({
  answerIndex,
  label,
  onClickAnswer,
}: QuizAnswerButtonProps) => {
  const handleClickAnswerButton = () => {
    onClickAnswer(answerIndex)
  }

  return (
    <button
      onClick={handleClickAnswerButton}
      className={`w-full h-12 px-4 leading-[calc(3rem+2px)] rounded-lg text-left text-primary-1 font-medium bg-primary-3 hover:bg-primary-1 hover:text-primary-4 transition-colors duration-200`}
    >
      {label}
    </button>
  )
}

export default QuizAnswerButton
