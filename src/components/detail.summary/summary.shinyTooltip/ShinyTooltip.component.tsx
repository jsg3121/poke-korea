import 'dialog-polyfill/dist/dialog-polyfill.css'
import { Fragment, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import ShinyTooltipModalComponent from './shinyTooltip.modal/ShinyTooltipModal.component'

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (dialogRef.current) {
        import('dialog-polyfill')
          .then((module) => {
            module.default.registerDialog(dialogRef.current!)
          })
          .catch((err) => {
            console.error('dialog-polyfill 로드 실패:', err)
          })
      }
    }
  }, [])

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
  color: var(--color-primary-1);
  background-color: var(--color-primary-4);
  border-radius: 0.75rem;
`
