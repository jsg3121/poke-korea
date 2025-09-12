export const quizProgress = (currentIndex: number, totalQuestions: number) => {
  return totalQuestions > 0
    ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
    : 0
}
