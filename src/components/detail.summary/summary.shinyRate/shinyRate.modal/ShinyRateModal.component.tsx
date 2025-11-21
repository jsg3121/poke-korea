import ModalTitleComponent from './modal.title/ModalTitle.component'
import ModalTableComponent from './modal.table/ModalTable.component'
import { forwardRef } from 'react'
import ModalDefinitionComponent from './modal.definition/ModalDefinition.component'
import ModalFooter from './modal.footer/ModalFooter'

interface ShinyRateModalComponentProps {
  onClickCloseModal: () => void
}

const ShinyRateModalComponent = forwardRef<
  HTMLDialogElement,
  ShinyRateModalComponentProps
>(({ onClickCloseModal }, ref) => {
  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  return (
    <dialog
      ref={ref}
      role="dialog"
      aria-labelledby="shiny-rate-title"
      aria-describedby="shiny-rate-description"
      className="w-[40rem] max-h-[35.5rem] border-0 rounded-2xl bg-primary-4 p-0 pb-6 px-6 m-0 fixed top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2 backdrop:bg-black/50 open:w-[40rem] open:max-w-[calc(100%-40px)] open:max-h-[80%] open:overflow-y-auto"
    >
      <ModalTitleComponent onClickClose={handleClickCloseModal} />
      <p id="shiny-rate-description" className="sr-only">
        포켓몬 세대별 이로치 포획률을 정리한 표입니다. 국제 교배와 빛나는 부적
        사용 여부에 따른 포획 확률도 포함되어 있습니다.
      </p>
      <ModalTableComponent />
      <ModalDefinitionComponent />
      <ModalFooter />
    </dialog>
  )
})

export default ShinyRateModalComponent
