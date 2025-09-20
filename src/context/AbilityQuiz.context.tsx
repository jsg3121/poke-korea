'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { QUIZ_CONSTANTS } from '~/constants/quiz.constants'
import { useGetAbilityQuizQuery } from '~/graphql/gqlGenerated'
import { useQuizTimer } from '~/hook/useQuizTimer'
import { quizProgress } from '~/module/quiz.module'
import {
  BaseQuizState,
  QuizResult,
  QuizViewStage,
  AbilityQuizQuestion,
} from '~/types/quiz.type'

interface AbilityQuizContextType {
  questions: AbilityQuizQuestion[]
  currentQuestionIndex: number
  progress: number
  timeElapsed: number
  isLoading: boolean
  isCompleted: boolean
  currentQuestion: AbilityQuizQuestion | null
  submitAnswer: (answerIndex: number) => void
  score: number
  totalTimeSpent: number
  result: QuizResult | null
  quizViewStage: QuizViewStage
  onChangeStage: (stage: QuizViewStage) => void
  onStartCountdown: () => void
  onClickRetryQuiz: () => void
}

interface AbilityQuizProviderProps {
  children: ReactNode
}

const AbilityQuizContext = createContext<AbilityQuizContextType | null>(null)

export const AbilityQuizProvider = ({ children }: AbilityQuizProviderProps) => {
  const [quizViewStage, setQuizViewStage] = useState<QuizViewStage>('BEFORE')
  const [quizState, setQuizState] = useState<BaseQuizState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    startTime: null,
    endTime: null,
    isLoading: false,
    isCompleted: false,
  })

  const { data, loading, refetch } = useGetAbilityQuizQuery({
    fetchPolicy: 'network-only',
  })

  const questions: AbilityQuizQuestion[] = data?.getAbilityQuiz || []
  const currentQuestion = questions[quizState.currentQuestionIndex] || null
  const timeElapsed = useQuizTimer(quizState.startTime)
  const progress = quizProgress(
    quizState.currentQuestionIndex,
    QUIZ_CONSTANTS.TOTAL_QUESTIONS,
  )

  const onChangeStage = (stage: QuizViewStage) => {
    setQuizViewStage(() => stage)
  }

  const onStartCountdown = () => {
    setQuizState((prev) => {
      return {
        ...prev,
        startTime: new Date(),
      }
    })
  }

  const onClickRetryQuiz = async () => {
    await refetch()
    setQuizViewStage('QUIZ')
    setQuizState(() => {
      return {
        currentQuestionIndex: 0,
        userAnswers: [],
        startTime: null,
        endTime: null,
        isLoading: false,
        isCompleted: false,
      }
    })
    window.scrollTo(0, 0)
  }

  const submitAnswer = (answerIndex: number) => {
    if (quizState.isCompleted || !currentQuestion) return

    const newAnswers = [...quizState.userAnswers, answerIndex]
    const isLastQuestion =
      quizState.currentQuestionIndex === QUIZ_CONSTANTS.TOTAL_QUESTIONS - 1

    setQuizState((prev) => ({
      ...prev,
      userAnswers: newAnswers,
      currentQuestionIndex: isLastQuestion
        ? prev.currentQuestionIndex
        : prev.currentQuestionIndex + 1,
      isCompleted: isLastQuestion,
      endTime: isLastQuestion ? new Date() : null,
    }))

    if (isLastQuestion) {
      setQuizViewStage('RESULT')
    }
  }

  const score =
    questions.length > 0
      ? quizState.userAnswers.reduce((count, answer, index) => {
          return answer === questions[index]?.correctAnswerIndex
            ? count + 1
            : count
        }, 0)
      : 0

  const totalTimeSpent =
    quizState.startTime && quizState.endTime
      ? Math.floor(
          (quizState.endTime.getTime() - quizState.startTime.getTime()) / 1000,
        )
      : 0

  const result: QuizResult | null = quizState.isCompleted
    ? {
        score,
        percentage: Math.round((score / questions.length) * 100),
        totalTime: totalTimeSpent,
        averageTime: Math.round(totalTimeSpent / questions.length),
        correctAnswers: score,
        wrongAnswers: questions.length - score,
        userAnswers: quizState.userAnswers,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options.map((opt) => opt.koreanName),
          correctAnswerIndex: q.correctAnswerIndex,
        })),
      }
    : null

  const contextValue: AbilityQuizContextType = {
    questions,
    currentQuestionIndex: quizState.currentQuestionIndex,
    progress,
    timeElapsed,
    isLoading: quizState.isLoading || loading,
    isCompleted: quizState.isCompleted,
    currentQuestion,
    score,
    totalTimeSpent,
    result,
    quizViewStage,
    submitAnswer,
    onChangeStage,
    onStartCountdown,
    onClickRetryQuiz,
  }

  return (
    <AbilityQuizContext.Provider value={contextValue}>
      {children}
    </AbilityQuizContext.Provider>
  )
}

export const useAbilityQuizContext = () => {
  const context = useContext(AbilityQuizContext)
  if (!context) {
    throw new Error('useAbilityQuiz must be used within a AbilityQuizProvider')
  }
  return context
}
