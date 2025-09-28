interface GuideStartButtonProps {
  onClickStartButton: () => void
}

const GuideStartButton = ({ onClickStartButton }: GuideStartButtonProps) => {
  const handleChangeStage = () => {
    onClickStartButton()
  }

  return (
    <button
      className="w-full h-[3rem] bg-primary-2 rounded-[20px] text-[1.125rem] text-primary-4 hover:bg-primary-1 transition-colors"
      onClick={handleChangeStage}
    >
      시작하기
    </button>
  )
}

export default GuideStartButton
