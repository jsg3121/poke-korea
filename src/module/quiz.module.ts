type QuizResultType = { headline: string; subcopy: string }

export const quizProgress = (currentIndex: number, totalQuestions: number) => {
  return totalQuestions > 0
    ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
    : 0
}

export const getQuizResultCopy = (score: number): QuizResultType => {
  const scorePoint = Math.max(0, Math.min(10, Math.floor(score)))

  if (scorePoint === 0) {
    return {
      headline: '시작은 언제나 0에서! 🔰',
      subcopy: '오늘은 예열 완료. 내일은 한 문제만 더!',
    }
  }

  if (scorePoint <= 2) {
    return {
      headline: '입문 트레이너의 첫걸음 👟',
      subcopy: '가장 많이 헷갈린 주제부터 가볍게 복습해볼까요?',
    }
  }

  if (scorePoint <= 4) {
    return {
      headline: '감 잡았다! ⚡️',
      subcopy: '벌써 절반 가까이. 약점/무효만 정리하면 점수 쭉↑',
    }
  }

  if (scorePoint <= 6) {
    return {
      headline: '배지 수집가의 길 🏅',
      subcopy: '안정적으로 정답 중! 반감/약점 페어만 더 익히면 상위권.',
    }
  }

  if (scorePoint <= 8) {
    return {
      headline: '엘리트 트레이너! 🔥',
      subcopy: '거의 완벽. 함정 보기(유사 타입/폼)를 구분하면 챔피언권.',
    }
  }

  if (scorePoint === 9) {
    return {
      headline: '챔피언 눈앞! 👑',
      subcopy: '단 1문제 차이. 실루엣 부분 힌트와 상성 무효 규칙만 점검하자.',
    }
  }

  return {
    headline: '포켓몬 마스터! 🌟',
    subcopy: '완벽 그 자체. 난이도↑ 혹은 반대 테마로 실력 확장해보자.',
  }
}
