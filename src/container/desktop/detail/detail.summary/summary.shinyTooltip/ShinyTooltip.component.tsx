import { Fragment, useState } from 'react'
import styled from 'styled-components'
import ShinyTooltipModalComponent from './shinyTooltip.modal/ShinyTooltipModal.component'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const ShinyTooltipComponent = () => {
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
      <Button onClick={handleClickOpenModal}>이로치란?</Button>
      <ShinyTooltipModalComponent
        isOpenModal={isOpenModal}
        onClickCloseModal={handleClickCloseModal}
      />
    </Fragment>
  )
}

export default ShinyTooltipComponent

const Button = styled.button`
  width: 4.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  text-align: center;
  background-color: var(--color-primary-4);
  border-radius: 0.75rem;
`
