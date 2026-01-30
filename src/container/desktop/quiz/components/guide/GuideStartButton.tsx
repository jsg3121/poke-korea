interface GuideStartButtonProps {
  onClickStartButton: () => void
}

const GuideStartButton = ({ onClickStartButton }: GuideStartButtonProps) => {
  const handleChangeStage = () => {
    window.scrollTo(0, 0)
    onClickStartButton()
  }

  return (
    <button
      className="h-[4rem] w-full bg-primary-2 rounded-[20px] text-xl text-primary-4 hover:bg-primary-1 hover:scale-[1.025] transition-[transform] duration-[0.15s]"
      onClick={handleChangeStage}
    >
      시작하기
    </button>
  )
}

export default GuideStartButton
