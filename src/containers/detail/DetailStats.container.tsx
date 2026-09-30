'use client'

import { useContext } from 'react'

import { DetailContext } from '~/context/Detail.context'
import SectionHeading from '~/components/SectionHeading.component'
import StatBar from '~/components/statBar/StatBar.component'

import { getActiveFormInfo } from './modules/activeForm.module'

const DetailStats = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  } = useContext(DetailContext)

  const { stats } = getActiveFormInfo({
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  })

  if (!stats) return null

  return (
    <section
      aria-labelledby="detail-stats-heading"
      className="w-full px-4 desktop:mx-auto desktop:max-w-7xl"
    >
      <SectionHeading id="detail-stats-heading">능력치</SectionHeading>
      <div className="card-detail mt-4">
        <StatBar
          stats={[
            { label: '체력', value: stats.hp },
            { label: '공격', value: stats.attack },
            { label: '특수공격', value: stats.specialAttack },
            { label: '방어', value: stats.defense },
            { label: '특수방어', value: stats.specialDefense },
            { label: '스피드', value: stats.speed },
          ]}
        />
      </div>
    </section>
  )
}

export default DetailStats
