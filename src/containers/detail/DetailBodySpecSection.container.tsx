'use client'

import { useContext } from 'react'

import {
  formatHeight,
  formatWeight,
  UNKNOWN_LABEL,
} from '~/modules/pokemonSpec.module'
import { DetailContext } from '~/context/Detail.context'

import { getActiveFormInfo } from './modules/activeForm.module'
import {
  DESC_CLASS,
  INFO_ROW_CLASS,
  TERM_CLASS,
} from './shared/detailSpec.constants'
import InfoCardTitle from './shared/InfoCardTitle.component'

const DetailBodySpecSection = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  } = useContext(DetailContext)

  if (!pokemonBaseInfo) return null

  const { height, weight } = getActiveFormInfo({
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  })

  const { genus, isLegendary, isMythical } = pokemonBaseInfo

  const rarityBadge = isLegendary
    ? '전설의 포켓몬'
    : isMythical
      ? '환상의 포켓몬'
      : undefined

  return (
    <section aria-labelledby="pokemon-body-spec" className="card-detail">
      <InfoCardTitle
        title="신체 정보"
        id="pokemon-body-spec"
        badge={rarityBadge}
      />
      <dl className="w-full">
        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>분류</dt>
          <dd className={DESC_CLASS}>{genus ?? UNKNOWN_LABEL}</dd>
        </div>
        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>키</dt>
          <dd className={DESC_CLASS}>{formatHeight(height)}</dd>
        </div>
        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>몸무게</dt>
          <dd className={DESC_CLASS}>{formatWeight(weight)}</dd>
        </div>
      </dl>
    </section>
  )
}

export default DetailBodySpecSection
