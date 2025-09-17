type QuizResultType = { headline: string; subcopy: string; medal: string }

export const quizProgress = (currentIndex: number, totalQuestions: number) => {
  return totalQuestions > 0
    ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
    : 0
}

export const getQuizResultCopy = (score: number): QuizResultType => {
  if (score <= 10) {
    return {
      headline: '입문 트레이너의 첫걸음 👟',
      medal: '🥉',
      subcopy: '가장 많이 헷갈린 포켓몬부터 다시 확인해볼까요?',
    }
  }

  if (score <= 16) {
    return {
      headline: '감 잡았다! ⚡️',
      medal: '🥈',
      subcopy: '벌써 절반 가까이. 만점까지 얼마 남지 않았어요!',
    }
  }

  if (score <= 19) {
    return {
      headline: '챔피언 눈앞! 👑',
      medal: '🥇',
      subcopy: '너무 아쉬워요...!! 한 번 더 도전 해보는건 어떨까요?',
    }
  }

  return {
    headline: '포켓몬 마스터! 🌟',
    medal: '🎖️',
    subcopy: '완벽 그 자체. 당신이 진정한 포켓몬 마스터!',
  }
}
