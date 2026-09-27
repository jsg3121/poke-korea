const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSczBdpna4GboDCrs2SjxyKsZagUiXU_cLJiTJeg_NPiHGo8yQ/viewform'

const FEEDBACK_FORM_PAGE_ENTRY = 'entry.1455610604'

export const buildFeedbackFormUrl = (pageUrl?: string) => {
  if (!pageUrl) {
    return FEEDBACK_FORM_URL
  }

  return `${FEEDBACK_FORM_URL}?usp=pp_url&${FEEDBACK_FORM_PAGE_ENTRY}=${encodeURIComponent(pageUrl)}`
}
