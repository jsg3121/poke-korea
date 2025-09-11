'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { useGetSilhouetteQuizLazyQuery } from '~/graphql/gqlGenerated'
import {
  SilhouetteQuizQuestion,
  BaseQuizState,
  BaseQuizContextType,
  QuizResult,
} from '~/types/quiz.type'
import { useQuizTimer, useQuizProgress } from '~/hooks/useQuizTimer'
import { generateQuizResult } from '~/utils/quiz.util'
import { QUIZ_CONSTANTS } from '~/constants/quiz.constants'

interface SilhouetteQuizContextType extends BaseQuizContextType {
  questions: SilhouetteQuizQuestion[]
  loadQuestions: () => void
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
  const [state, setState] = useState<BaseQuizState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    startTime: null,
    endTime: null,
    isLoading: false,
    isCompleted: false,
  })

  const [fetchQuestions, { data, loading }] = useGetSilhouetteQuizLazyQuery()

  const questions: SilhouetteQuizQuestion[] = data?.getSilhouetteQuiz || []
  const currentQuestion = questions[state.currentQuestionIndex] || null
  const timeElapsed = useQuizTimer(state.startTime)
  const progress = useQuizProgress(
    state.currentQuestionIndex,
    QUIZ_CONSTANTS.TOTAL_QUESTIONS,
  )

  const loadQuestions = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      await fetchQuestions()
      setState((prev) => ({
        ...prev,
        isLoading: false,
        startTime: new Date(),
        currentQuestionIndex: 0,
        userAnswers: [],
        isCompleted: false,
        endTime: null,
      }))
    } catch (error) {
      console.error('Failed to load silhouette quiz questions:', error)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

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

  const resetQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      userAnswers: [],
      startTime: null,
      endTime: null,
      isLoading: false,
      isCompleted: false,
    })
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
    submitAnswer,
    resetQuiz,
    score,
    totalTimeSpent,
    result,
    loadQuestions,
  }

  return (
    <SilhouetteQuizContext.Provider value={contextValue}>
      {children}
    </SilhouetteQuizContext.Provider>
  )
}

export const useSilhouetteQuiz = () => {
  const context = useContext(SilhouetteQuizContext)
  if (!context) {
    throw new Error(
      'useSilhouetteQuiz must be used within a SilhouetteQuizProvider',
    )
  }
  return context
}
