'use client'

import { Fragment, useRef, useState } from 'react'
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
      <button
        onClick={handleClickOpenModal}
        className="w-[5.5rem] h-6 text-xs text-center text-aligned-sm text-primary-1 bg-primary-4 rounded-xl"
      >
        이로치 포획률
      </button>
      <ShinyRateModalComponent
        ref={dialogRef}
        onClickCloseModal={handleClickCloseModal}
      />
    </Fragment>
  )
}

export default ShinyRateComponent
