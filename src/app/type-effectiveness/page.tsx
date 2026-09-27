import { Fragment } from 'react'

import {
  TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD,
  TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD,
} from '~/constants/typeEffectivenessJsonLd'
import TypeEffectiveness from '~/views/typeEffectiveness/TypeEffectiveness.view'

import { TYPE_EFFECTIVENESS_META } from './_metadata/typeEffectivenessMetadata'

export const metadata = TYPE_EFFECTIVENESS_META

const TypeEffectivenessPage = async () => {
  return (
    <Fragment>
      <TypeEffectiveness />
      <script
        id="type-effectiveness-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_WEBPAGE_JSON_LD),
        }}
      />
      <script
        id="type-effectiveness-itemlist-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TYPE_EFFECTIVENESS_ITEMLIST_JSON_LD),
        }}
      />
    </Fragment>
  )
}

export default TypeEffectivenessPage
