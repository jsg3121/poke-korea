export type QuizType =
  | 'silhouette'
  | 'ability'
  | 'pokemon-type'
  | 'type-effectiveness'

export interface BaseQuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswerIndex: number
}

export interface SilhouetteQuizQuestion extends BaseQuizQuestion {
  correctPokemonId: number
}

export interface AbilityQuizQuestion {
  abilityDescription: string
  id: string
  question: string
  correctAnswerIndex: number
  options: Array<{
    koreanName: string
  }>
}

export interface PokemonTypeQuizQuestion {
  id: string
  question: string
  correctAnswerIndex: number
  targetType: string
  options: Array<{
    id: string
    koreanName: string
    types: string[]
  }>
}

export interface TypeEffectivenessQuizQuestion extends BaseQuizQuestion {
  attackingType: string
  defendingTypes: string[]
  effectiveness: number
}

export interface BaseQuizState {
  currentQuestionIndex: number
  userAnswers: number[]
  startTime: Date | null
  endTime: Date | null
  isLoading: boolean
  isCompleted: boolean
}

export interface QuizResult {
  score: number
  percentage: number
  totalTime: number
  averageTime: number
  correctAnswers: number
  wrongAnswers: number
  userAnswers: number[]
  questions: BaseQuizQuestion[]
}

export interface BaseQuizContextType {
  currentQuestionIndex: number
  progress: number
  timeElapsed: number
  isLoading: boolean
  isCompleted: boolean
  currentQuestion: BaseQuizQuestion | null
  submitAnswer: (answerIndex: number) => void
  resetQuiz: () => void
  score: number
  totalTimeSpent: number
  result: QuizResult | null
}

/**
 * @description 퀴즈 스테이지
 *
 * 'BEFORE' : 퀴즈 시작 전
 *
 * 'QUIZ' : 퀴즈 시작
 *
 * 'RESULT' : 퀴즈 결과
 */
export type QuizViewStage = 'BEFORE' | 'QUIZ' | 'RESULT'
