import { BaseQuizQuestion, QuizResult } from '~/types/quiz.type'

export const calculateScore = (
  userAnswers: number[],
  questions: BaseQuizQuestion[],
): number => {
  if (questions.length === 0) return 0

  const correctCount = userAnswers.reduce((count, answer, index) => {
    return answer === questions[index]?.correctAnswerIndex ? count + 1 : count
  }, 0)

  return correctCount
}

export const calculatePercentage = (score: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}

export const calculateTotalTime = (
  startTime: Date | null,
  endTime: Date | null,
): number => {
  if (!startTime || !endTime) return 0
  return Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
}

export const calculateAverageTime = (
  totalTime: number,
  questionCount: number,
): number => {
  if (questionCount === 0) return 0
  return Math.round(totalTime / questionCount)
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) {
    return `${remainingSeconds}초`
  }

  return `${minutes}분 ${remainingSeconds}초`
}

export const formatTimeShort = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const generateQuizResult = (
  userAnswers: number[],
  questions: BaseQuizQuestion[],
  startTime: Date | null,
  endTime: Date | null,
): QuizResult => {
  const score = calculateScore(userAnswers, questions)
  const percentage = calculatePercentage(score, questions.length)
  const totalTime = calculateTotalTime(startTime, endTime)
  const averageTime = calculateAverageTime(totalTime, questions.length)
  const correctAnswers = score
  const wrongAnswers = questions.length - score

  return {
    score,
    percentage,
    totalTime,
    averageTime,
    correctAnswers,
    wrongAnswers,
    userAnswers,
    questions,
  }
}

export const getQuizTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    silhouette: '실루엣 퀴즈',
    ability: '특성 퀴즈',
    'pokemon-type': '포켓몬 타입 퀴즈',
    'type-effectiveness': '타입 상성 퀴즈',
  }

  return typeMap[type] || '퀴즈'
}

export const getQuizTypeDescription = (type: string): string => {
  const descriptionMap: Record<string, string> = {
    silhouette: '포켓몬 실루엣을 보고 어떤 포켓몬인지 맞춰보세요!',
    ability: '포켓몬 특성 설명을 보고 어떤 특성인지 맞춰보세요!',
    'pokemon-type': '특정 타입을 가진 포켓몬을 골라보세요!',
    'type-effectiveness': '타입 상성을 계산해서 정답을 맞춰보세요!',
  }

  return descriptionMap[type] || '퀴즈를 풀어보세요!'
}
