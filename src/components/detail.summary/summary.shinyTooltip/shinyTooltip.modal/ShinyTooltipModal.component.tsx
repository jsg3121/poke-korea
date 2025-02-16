import styled from 'styled-components'
import ModalDescriptionComponent from './modal.description/ModalDescription.component'
import ModalTitleComponent from './modal.title/ModalTitle.component'
import { forwardRef } from 'react'

interface ShinyTooltipModalComponentProps {
  onClickCloseModal: () => void
}

const ShinyTooltipModalComponent = forwardRef<
  HTMLDialogElement,
  ShinyTooltipModalComponentProps
>(({ onClickCloseModal }, ref) => {
  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  return (
    <Dialog
      ref={ref}
      role="dialog"
      aria-labelledby="shiny-info-title"
      aria-describedby="shiny-info-description"
    >
      <ModalTitleComponent onClickClose={handleClickCloseModal} />
      <p id="shiny-info-description" className="visually-hidden">
        색이다른 포켓몬의 정의와 어떤 특징을 가지고 있는지 설명합니다.
      </p>
      <ModalDescriptionComponent />
    </Dialog>
  )
})

export default ShinyTooltipModalComponent

const Dialog = styled.dialog`
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  width: 40rem;
  max-height: 35.5rem;
  border: 0;
  border-radius: 1rem;
  background-color: var(--color-primary-4);
  padding: 0 1.5rem 1.5rem;
  margin: 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &[open] {
    width: 40rem;
    max-width: calc(100% - 40px);
    max-height: 80%;
    overflow-y: auto;
  }
`
