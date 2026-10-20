export const RESULT_TITLE_ID = 'type-calculator-result-title'

/**
 * 계산 결과 제목이 화면 밖에 있으면 제목이 보이도록 스크롤한다.
 */
export const scrollToResultTitle = () => {
  const title = document.getElementById(RESULT_TITLE_ID)
  if (!title) return

  const { top, bottom } = title.getBoundingClientRect()
  if (top >= 0 && bottom <= window.innerHeight) return

  title.scrollIntoView({ block: 'start' })
}
