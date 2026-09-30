import { Fragment } from 'react'

import Privacy from '~/views/privacy/Privacy.view'

import { PRIVACY_META } from './_metadata/privacyMetadata'

export const revalidate = 31536000

export const metadata = PRIVACY_META

const PrivacyPage = async () => {
  return (
    <Fragment>
      <Privacy />
    </Fragment>
  )
}

export default PrivacyPage
