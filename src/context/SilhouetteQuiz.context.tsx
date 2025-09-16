'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { QUIZ_CONSTANTS } from '~/constants/quiz.constants'
import { useGetSilhouetteQuizQuery } from '~/graphql/gqlGenerated'
import { useQuizTimer } from '~/hook/useQuizTimer'
import { quizProgress } from '~/module/quiz.module'
import {
  BaseQuizContextType,
  BaseQuizState,
  QuizResult,
  QuizViewStage,
  SilhouetteQuizQuestion,
} from '~/types/quiz.type'
import { generateQuizResult } from '~/utils/quiz.util'

interface SilhouetteQuizContextType extends BaseQuizContextType {
  questions: SilhouetteQuizQuestion[]
  quizViewStage: QuizViewStage
  onChangeStage: (stage: QuizViewStage) => void
  showCountdown: boolean
  startCountdown: () => void
  cancelCountdown: () => void
}

interface SilhouetteQuizProviderProps {
  children: ReactNode
}

const SilhouetteQuizContext = createContext<SilhouetteQuizContextType | null>(
  null,
)

export const SilhouetteQuizProvider = ({
  children,
}: SilhouetteQuizProviderProps) => {
  const [quizViewStage, setQuizViewStage] = useState<QuizViewStage>('BEFORE')
  const [showCountdown, setShowCountdown] = useState(false)
  const [state, setState] = useState<BaseQuizState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    startTime: null,
    endTime: null,
    isLoading: false,
    isCompleted: false,
  })

  const { data, loading } = useGetSilhouetteQuizQuery()

  const questions: SilhouetteQuizQuestion[] = data?.getSilhouetteQuiz || []
  const currentQuestion = questions[state.currentQuestionIndex] || null
  const timeElapsed = useQuizTimer(state.startTime)
  const progress = quizProgress(
    state.currentQuestionIndex,
    QUIZ_CONSTANTS.TOTAL_QUESTIONS,
  )

  const submitAnswer = (answerIndex: number) => {
    if (state.isCompleted || !currentQuestion) return

    const newAnswers = [...state.userAnswers, answerIndex]
    const isLastQuestion =
      state.currentQuestionIndex === QUIZ_CONSTANTS.TOTAL_QUESTIONS - 1

    setState((prev) => ({
      ...prev,
      userAnswers: newAnswers,
      currentQuestionIndex: isLastQuestion
        ? prev.currentQuestionIndex
        : prev.currentQuestionIndex + 1,
      isCompleted: isLastQuestion,
      endTime: isLastQuestion ? new Date() : null,
    }))
  }

  const onChangeStage = (stage: QuizViewStage) => {
    setQuizViewStage(() => stage)
  }

  const startCountdown = () => {
    setShowCountdown(true)
  }

  const cancelCountdown = () => {
    setShowCountdown(false)
  }

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setQuizViewStage('QUIZ')
    setState(prev => ({ 
      ...prev, 
      startTime: new Date(),
      currentQuestionIndex: 0,
      userAnswers: [],
      isCompleted: false,
      endTime: null,
    }))
  }

  const score =
    questions.length > 0
      ? state.userAnswers.reduce((count, answer, index) => {
          return answer === questions[index]?.correctAnswerIndex
            ? count + 1
            : count
        }, 0)
      : 0

  const totalTimeSpent =
    state.startTime && state.endTime
      ? Math.floor((state.endTime.getTime() - state.startTime.getTime()) / 1000)
      : 0

  const result: QuizResult | null = state.isCompleted
    ? generateQuizResult(
        state.userAnswers,
        questions,
        state.startTime,
        state.endTime,
      )
    : null

  const contextValue: SilhouetteQuizContextType = {
    questions,
    currentQuestionIndex: state.currentQuestionIndex,
    progress,
    timeElapsed,
    isLoading: state.isLoading || loading,
    isCompleted: state.isCompleted,
    currentQuestion,
    score,
    totalTimeSpent,
    result,
    quizViewStage,
    submitAnswer,
    onChangeStage,
  }

  return (
    <SilhouetteQuizContext.Provider value={contextValue}>
      {children}
    </SilhouetteQuizContext.Provider>
  )
}

export const useSilhouetteQuizContext = () => {
  const context = useContext(SilhouetteQuizContext)
  if (!context) {
    throw new Error(
      'useSilhouetteQuiz must be used within a SilhouetteQuizProvider',
    )
  }
  return context
}
