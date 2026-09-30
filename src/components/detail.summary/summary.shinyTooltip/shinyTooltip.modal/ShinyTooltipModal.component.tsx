import { forwardRef } from 'react'

import ModalDescription from './modal.description/ModalDescription.component'
import ModalTitle from './modal.title/ModalTitle.component'

interface ShinyTooltipModalProps {
  onClickCloseModal: () => void
}

const ShinyTooltipModal = forwardRef<HTMLDialogElement, ShinyTooltipModalProps>(
  ({ onClickCloseModal }, ref) => {
    const handleClickCloseModal = () => {
      onClickCloseModal()
    }

    return (
      <dialog
        ref={ref}
        role="dialog"
        aria-labelledby="shiny-info-title"
        aria-describedby="shiny-info-description"
        className="w-[40rem] max-h-[35.5rem] border-0 rounded-2xl bg-primary-4 p-0 pb-6 px-6 m-0 fixed top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2 backdrop:bg-black/50 open:w-[40rem] open:max-w-[calc(100%-40px)] open:max-h-[80%] open:overflow-y-auto"
      >
        <ModalTitle onClickClose={handleClickCloseModal} />
        <p id="shiny-info-description" className="sr-only">
          색이다른 포켓몬의 정의와 어떤 특징을 가지고 있는지 설명합니다.
        </p>
        <ModalDescription />
      </dialog>
    )
  },
)

export default ShinyTooltipModal
