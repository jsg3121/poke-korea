import { Fragment, useRef, useState } from 'react'
import styled from 'styled-components'
import ShinyTooltipModalComponent from './shinyTooltip.modal/ShinyTooltipModal.component'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

const ShinyTooltipComponent = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

  const checkOpenDialog = (isDialogOpen?: boolean) => {
    const isOpen = isDialogOpen || false
    setIsOpenDialog(() => isOpen)
  }

  const handleClickOpenModal = () => {
    dialogRef.current?.showModal()
    checkOpenDialog(dialogRef.current?.open)
  }

  const handleClickCloseModal = () => {
    dialogRef.current?.close()
    checkOpenDialog(dialogRef.current?.open)
  }

  useBodyScrollLock(isOpenDialog)
  return (
    <Fragment>
      <Button onClick={handleClickOpenModal}>이로치란?</Button>
      <ShinyTooltipModalComponent
        ref={dialogRef}
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
  line-height: calc(1.5rem + 2px);
  text-align: center;
  background-color: var(--color-primary-4);
  border-radius: 0.75rem;
`
