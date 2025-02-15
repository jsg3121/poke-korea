import { Fragment, useState } from 'react'
import styled from 'styled-components'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import ShinyRateModalComponent from './shinyRate.modal/ShinyRateModal.component'

const ShinyRateComponent = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const handleClickOpenModal = () => {
    setIsOpenModal(() => true)
  }

  const handleClickCloseModal = () => {
    setIsOpenModal(() => false)
  }

  useBodyScrollLock(isOpenModal)

  return (
    <Fragment>
      <Button onClick={handleClickOpenModal}>이로치 포획률</Button>
      <ShinyRateModalComponent
        isOpenModal={isOpenModal}
        onClickCloseModal={handleClickCloseModal}
      />
    </Fragment>
  )
}

export default ShinyRateComponent

const Button = styled.button`
  width: 5.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  text-align: center;
  background-color: var(--color-primary-4);
  border-radius: 0.75rem;
`
