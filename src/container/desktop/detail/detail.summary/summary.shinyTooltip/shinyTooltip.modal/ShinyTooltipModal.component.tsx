import styled from 'styled-components'
import ModalDescriptionComponent from './modal.description/ModalDescription.component'
import ModalTitleComponent from './modal.title/ModalTitle.component'

interface ShinyTooltipModalComponentProps {
  isOpenModal: boolean
  onClickCloseModal: () => void
}

const ShinyTooltipModalComponent = ({
  isOpenModal,
  onClickCloseModal,
}: ShinyTooltipModalComponentProps) => {
  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  return (
    <Dialog open={isOpenModal}>
      <div>
        <ModalTitleComponent onClickClose={handleClickCloseModal} />
        <ModalDescriptionComponent />
      </div>
    </Dialog>
  )
}

export default ShinyTooltipModalComponent

const Dialog = styled.dialog`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;

  & > div {
    width: 40rem;
    height: 35.5rem;
    border-radius: 1rem;
    background-color: var(--color-primary-4);
    padding: 1.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
