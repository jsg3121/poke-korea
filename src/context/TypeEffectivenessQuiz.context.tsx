'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import { QUIZ_CONSTANTS } from '~/constants/quiz.constants'
import { useQuizTimer } from '~/hook/useQuizTimer'
import { quizProgress } from '~/module/quiz.module'
import {
  BaseQuizState,
  QuizResult,
  QuizViewStage,
  TypeEffectivenessQuizQuestion,
} from '~/types/quiz.type'
import { generateTypeEffectivenessQuestions } from '~/module/typeEffectivenessQuiz.module'

interface TypeEffectivenessQuizContextType {
  questions: TypeEffectivenessQuizQuestion[]
  currentQuestionIndex: number
  progress: number
  timeElapsed: number
  isLoading: boolean
  isCompleted: boolean
  currentQuestion: TypeEffectivenessQuizQuestion | null
  submitAnswer: (answerIndex: number) => void
  score: number
  totalTimeSpent: number
  result: QuizResult | null
  quizViewStage: QuizViewStage
  onChangeStage: (stage: QuizViewStage) => void
  onStartCountdown: () => void
  onClickRetryQuiz: () => void
}

interface TypeEffectivenessQuizProviderProps {
  children: ReactNode
}

const TypeEffectivenessQuizContext =
  createContext<TypeEffectivenessQuizContextType | null>(null)

export const TypeEffectivenessQuizProvider = ({
  children,
}: TypeEffectivenessQuizProviderProps) => {
  const [quizViewStage, setQuizViewStage] = useState<QuizViewStage>('BEFORE')
  const [questions, setQuestions] = useState<TypeEffectivenessQuizQuestion[]>(
    [],
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizState, setQuizState] = useState<BaseQuizState>({
    currentQuestionIndex: 0,
    userAnswers: [],
    startTime: null,
    endTime: null,
    isLoading: false,
    isCompleted: false,
  })

  // 퀴즈 문제 생성
  const generateQuestions = () => {
    setIsGenerating(true)
    try {
      const newQuestions = generateTypeEffectivenessQuestions(
        QUIZ_CONSTANTS.TOTAL_QUESTIONS,
      )
      setQuestions(newQuestions)
    } catch (error) {
      console.error('퀴즈 문제 생성 중 오류 발생:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // 컴포넌트 마운트 시 문제 생성
  useEffect(() => {
    if (questions.length === 0) {
      generateQuestions()
    }
  }, [])

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

  const onClickRetryQuiz = () => {
    generateQuestions()
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
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
        })),
      }
    : null

  const contextValue: TypeEffectivenessQuizContextType = {
    questions,
    currentQuestionIndex: quizState.currentQuestionIndex,
    progress,
    timeElapsed,
    isLoading: quizState.isLoading || isGenerating,
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
    <TypeEffectivenessQuizContext.Provider value={contextValue}>
      {children}
    </TypeEffectivenessQuizContext.Provider>
  )
}

export const useTypeEffectivenessQuizContext = () => {
  const context = useContext(TypeEffectivenessQuizContext)
  if (!context) {
    throw new Error(
      'useTypeEffectivenessQuizContext must be used within a TypeEffectivenessQuizProvider',
    )
  }
  return context
}
