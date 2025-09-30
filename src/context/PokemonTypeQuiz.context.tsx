'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { QUIZ_CONSTANTS } from '~/constants/quiz.constants'
import { useGetPokemonTypeQuizQuery } from '~/graphql/gqlGenerated'
import { useQuizTimer } from '~/hook/useQuizTimer'
import { quizProgress } from '~/module/quiz.module'
import {
  BaseQuizState,
  QuizResult,
  QuizViewStage,
  PokemonTypeQuizQuestion,
} from '~/types/quiz.type'

interface PokemonTypeQuizContextType {
  questions: PokemonTypeQuizQuestion[]
  currentQuestionIndex: number
  progress: number
  timeElapsed: number
  isLoading: boolean
  isCompleted: boolean
  currentQuestion: PokemonTypeQuizQuestion | null
  submitAnswer: (answerIndex: number) => void
  score: number
  totalTimeSpent: number
  result: QuizResult | null
  quizViewStage: QuizViewStage
  onChangeStage: (stage: QuizViewStage) => void
  onStartCountdown: () => void
  onClickRetryQuiz: () => void
}

interface PokemonTypeQuizProviderProps {
  children: ReactNode
}

const PokemonTypeQuizContext = createContext<PokemonTypeQuizContextType | null>(
  null,
)

export const PokemonTypeQuizProvider = ({
  children,
}: PokemonTypeQuizProviderProps) => {
  const [quizViewStage, setQuizViewStage] = useState<QuizViewStage>('BEFORE')
  const [quizState, setQuizState] = useState<BaseQuizState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    startTime: null,
    endTime: null,
    isLoading: false,
    isCompleted: false,
  })

  const { data, loading, refetch } = useGetPokemonTypeQuizQuery({
    fetchPolicy: 'network-only',
  })

  const questions: PokemonTypeQuizQuestion[] =
    data?.getPokemonTypeQuiz?.map((q) => ({
      id: q.id,
      question: q.question,
      correctAnswerIndex: q.correctAnswerIndex,
      targetType: q.targetType,
      options: q.options.map((opt) => ({
        id: opt.id,
        koreanName: opt.koreanName,
        types: opt.types.map((type) => type),
      })),
    })) || []
  const currentQuestion = questions[quizState.currentQuestionIndex] || null
  const { timeElapsed, onCloseTimer } = useQuizTimer(quizState.startTime)
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
      onCloseTimer()
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

  const contextValue: PokemonTypeQuizContextType = {
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
    <PokemonTypeQuizContext.Provider value={contextValue}>
      {children}
    </PokemonTypeQuizContext.Provider>
  )
}

export const usePokemonTypeQuizContext = () => {
  const context = useContext(PokemonTypeQuizContext)
  if (!context) {
    throw new Error(
      'usePokemonTypeQuiz must be used within a PokemonTypeQuizProvider',
    )
  }
  return context
}
