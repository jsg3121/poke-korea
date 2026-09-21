/**
 * 기능/오류 신고 폼.
 *
 * forms.gle 단축 URL은 리다이렉트 과정에서 쿼리가 유실되어 사전 입력이
 * 동작하지 않는다. 사전 입력을 쓰려면 반드시 전체 URL이어야 한다.
 */
const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSczBdpna4GboDCrs2SjxyKsZagUiXU_cLJiTJeg_NPiHGo8yQ/viewform'

/**
 * '발생한 페이지' 단답형 문항의 필드 ID.
 *
 * 폼 편집 화면의 '사전 입력된 링크 가져오기'로 확인한다. 문항을 삭제 후
 * 재생성하면 새 ID가 발급되므로 이 값도 함께 갱신해야 한다.
 */
const FEEDBACK_FORM_PAGE_ENTRY = 'entry.1455610604'

/**
 * 신고 폼 URL을 만든다.
 *
 * 폼 제보에는 "페이지가 안 나옴"처럼 발생 위치를 알 수 없는 내용이 반복해서
 * 들어온다. 진입 시점의 주소를 실어 보내면 사용자가 적지 않아도 위치가 남는다.
 *
 * @param pageUrl 신고 진입 시점의 전체 주소. 없으면 사전 입력 없는 폼을 연다
 */
export const buildFeedbackFormUrl = (pageUrl?: string) => {
  if (!pageUrl) {
    return FEEDBACK_FORM_URL
  }

  return `${FEEDBACK_FORM_URL}?usp=pp_url&${FEEDBACK_FORM_PAGE_ENTRY}=${encodeURIComponent(pageUrl)}`
}
