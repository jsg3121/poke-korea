import Button from '~/components/button/Button.component'

interface GuideStartButtonProps {
  onClickStartButton: () => void
}

const GuideStartButton = ({ onClickStartButton }: GuideStartButtonProps) => {
  const handleChangeStage = () => {
    window.scrollTo(0, 0)
    onClickStartButton()
  }

  return (
    <Button variant="secondary" size="lg" fullWidth onClick={handleChangeStage}>
      시작하기
    </Button>
  )
}

export default GuideStartButton
