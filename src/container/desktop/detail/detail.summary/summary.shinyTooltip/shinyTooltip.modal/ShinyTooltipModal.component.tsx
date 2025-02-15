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
    <Div className={isOpenModal ? 'show-modal' : ''}>
      <aside>
        <ModalTitleComponent onClickClose={handleClickCloseModal} />
        <ModalDescriptionComponent />
      </aside>
    </Div>
  )
}

export default ShinyTooltipModalComponent

const Div = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;

  &.show-modal {
    display: block;
  }

  & > aside {
    width: 40rem;
    height: 35.5rem;
    border-radius: 1rem;
    background-color: #ffffff;
    padding: 1.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
