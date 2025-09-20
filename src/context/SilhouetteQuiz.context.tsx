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

interface SilhouetteQuizContextType
  extends BaseQuizContextType<SilhouetteQuizQuestion> {
  questions: SilhouetteQuizQuestion[]
  quizViewStage: QuizViewStage
  onChangeStage: (stage: QuizViewStage) => void
  onStartCountdown: () => void
  onClickRetryQuiz: () => void
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
  const [quizState, setQuizState] = useState<BaseQuizState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    startTime: null,
    endTime: null,
    isLoading: false,
    isCompleted: false,
  })

  const { data, loading, refetch } = useGetSilhouetteQuizQuery({
    fetchPolicy: 'network-only',
  })

  const questions: SilhouetteQuizQuestion[] = data?.getSilhouetteQuiz || []
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
    ? generateQuizResult(
        quizState.userAnswers,
        questions,
        quizState.startTime,
        quizState.endTime,
      )
    : null

  const contextValue: SilhouetteQuizContextType = {
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
