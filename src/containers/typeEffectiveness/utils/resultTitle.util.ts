import { RESULT_TITLE_ID } from '../shared/resultTitle.constants'

/**
 * 계산 결과 제목이 화면 위쪽에 오도록 스크롤한다.
 */
export const scrollToResultTitle = () => {
  document
    .getElementById(RESULT_TITLE_ID)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
