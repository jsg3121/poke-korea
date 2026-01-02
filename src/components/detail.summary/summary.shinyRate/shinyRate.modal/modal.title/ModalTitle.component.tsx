import CloseIcon from '~/assets/close.svg'

interface ModalTitleComponentProps {
  onClickClose: () => void
}

const ModalTitleComponent = ({ onClickClose }: ModalTitleComponentProps) => {
  const handleClickClose = () => {
    onClickClose()
  }

  return (
    <header className="w-full h-[4.5rem] border-b border-solid border-[#333333] bg-primary-4 flex-between pt-6 pb-3 sticky top-0">
      <h2
        id="shiny-rate-title"
        className="h-12 text-[1.75rem] font-medium leading-[3rem]"
      >
        이로치 포획률
      </h2>
      <button
        aria-label="이로치 포획률 팝업 닫기"
        onClick={handleClickClose}
        className="w-8 h-8 p-1"
      >
        <CloseIcon width="1.5rem" height="1.5rem" className="fill-primary-1" />
      </button>
    </header>
  )
}

export default ModalTitleComponent
