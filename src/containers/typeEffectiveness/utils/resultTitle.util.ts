import { RESULT_TITLE_ID } from '../shared/resultTitle.constants'

/**
 * 계산 결과 제목이 화면 위쪽에 오도록 스크롤하고, 필요하면 포커스를 옮긴다.
 * @param shouldFocus 키보드로 고른 경우처럼 포커스를 결과 제목으로 옮겨야 하는지
 */
export const moveToResultTitle = (shouldFocus: boolean) => {
  const title = document.getElementById(RESULT_TITLE_ID)
  if (!title) return

  title.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (shouldFocus) {
    title.focus({ preventScroll: true })
  }
}
