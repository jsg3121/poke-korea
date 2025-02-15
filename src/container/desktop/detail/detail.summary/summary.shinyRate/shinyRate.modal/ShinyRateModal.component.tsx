import styled from 'styled-components'
import ModalTitleComponent from './modal.title/ModalTitle.component'
import ModalTableComponent from './modal.table/ModalTable.component'

interface ShinyRateModalComponentProps {
  isOpenModal: boolean
  onClickCloseModal: () => void
}

const ShinyRateModalComponent = ({
  isOpenModal,
  onClickCloseModal,
}: ShinyRateModalComponentProps) => {
  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  return (
    <Div className={isOpenModal ? 'show-modal' : ''}>
      <aside>
        <ModalTitleComponent onClickClose={handleClickCloseModal} />
        <ModalTableComponent />
      </aside>
    </Div>
  )
}

export default ShinyRateModalComponent

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
    min-height: 35.5rem;
    border-radius: 1rem;
    background-color: var(--color-primary-4);
    padding: 1.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
