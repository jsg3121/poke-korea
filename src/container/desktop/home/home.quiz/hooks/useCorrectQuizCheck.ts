import { useState } from 'react'

type useCorrectQuizCheckParams = {
  correctAnswer: number
}

type useCorrectQuizCheckHook = (params: useCorrectQuizCheckParams) => {
  isCorrect: boolean
  isShowModal: boolean
  handleSelectAnswer: (selectAnswer: number) => void
  handleCloseModal: () => void
}

export const useCorrectQuizCheck: useCorrectQuizCheckHook = ({
  correctAnswer,
}) => {
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [isShowModal, setIsShowModal] = useState<boolean>(false)

  const handleSelectAnswer = (selectAnswer: number) => {
    setIsCorrect(() => correctAnswer === selectAnswer)
    setIsShowModal(true)
  }

  const handleCloseModal = () => {
    setIsShowModal(false)
  }

  return {
    isCorrect,
    isShowModal,
    handleSelectAnswer,
    handleCloseModal,
  }
}
