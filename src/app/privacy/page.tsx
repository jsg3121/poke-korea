import { Fragment } from 'react'

import Privacy from '~/views/privacy/Privacy.view'

import { PRIVACY_META } from './_metadata/privacyMetadata'

// 법령·서비스 변경 시에만 갱신되는 정적 문서라 재검증 주기를 길게 둔다.
export const revalidate = 31536000

export const metadata = PRIVACY_META

const PrivacyPage = async () => {
  return (
    <Fragment>
      {/* 본문은 반응형 단일(Privacy, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(quiz·champions와 동일 패턴). */}
      <Privacy />
    </Fragment>
  )
}

export default PrivacyPage
