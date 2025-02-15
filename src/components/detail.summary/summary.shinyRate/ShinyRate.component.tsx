import { Fragment, useRef, useState } from 'react'
import styled from 'styled-components'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import ShinyRateModalComponent from './shinyRate.modal/ShinyRateModal.component'

const ShinyRateComponent = () => {
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
      <Button onClick={handleClickOpenModal}>이로치 포획률</Button>
      <ShinyRateModalComponent
        ref={dialogRef}
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
  line-height: calc(1.5rem + 2px);
  background-color: var(--color-primary-4);
  border-radius: 0.75rem;
`
