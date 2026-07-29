import ButtonComponent from '~/components/button/Button.component'

/**
 * 퀴즈 시작 버튼 (BEFORE 단계). 클릭 시 스크롤 상단 이동 후 stage 전환.
 * 기존 커스텀 버튼(bg-primary-2 h-[4rem] rounded-[20px])을 DS Button으로 교체한다
 * (secondary variant = primary-3→primary-2 hover, lg size = 48px, focus-visible 내장).
 */
interface GuideStartButtonProps {
  onClickStartButton: () => void
}

const GuideStartButtonComponent = ({
  onClickStartButton,
}: GuideStartButtonProps) => {
  const handleChangeStage = () => {
    window.scrollTo(0, 0)
    onClickStartButton()
  }

  return (
    <ButtonComponent
      variant="secondary"
      size="lg"
      fullWidth
      onClick={handleChangeStage}
    >
      시작하기
    </ButtonComponent>
  )
}

export default GuideStartButtonComponent
