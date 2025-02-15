import styled from 'styled-components'
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
    <Dialog
      ref={ref}
      role="dialog"
      aria-labelledby="shiny-rate-title"
      aria-describedby="shiny-rate-description"
    >
      <ModalTitleComponent onClickClose={handleClickCloseModal} />
      <p id="shiny-rate-description" className="visually-hidden">
        포켓몬 세대별 이로치 포획률을 정리한 표입니다. 국제 교배와 빛나는 부적
        사용 여부에 따른 포획 확률도 포함되어 있습니다.
      </p>
      <ModalTableComponent />
      <ModalDefinitionComponent />
      <ModalFooter />
    </Dialog>
  )
})

export default ShinyRateModalComponent

const Dialog = styled.dialog`
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  width: 40rem;
  min-height: 35.5rem;
  border: 0;
  border-radius: 1rem;
  background-color: var(--color-primary-4);
  padding: 1.5rem;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
