'use client'

import { useContext, useState } from 'react'
import { usePathname } from 'next/navigation'

import { trackEvent } from '~/modules/analytics.module'
import { DetailContext } from '~/context/Detail.context'
import SectionHeading from '~/components/SectionHeading.component'
import SegmentedControl from '~/components/segmentedControl/SegmentedControl.component'
import StatBar from '~/components/statBar/StatBar.component'

import DetailRealStatTable from './DetailRealStatTable.component'
import { getActiveFormInfo } from './modules/activeForm.module'
import { toDetailFormTypeParam } from './utils/statsFormType.util'

type StatsView = 'base' | 'real'

const VIEW_ITEMS = [
  { key: 'base', label: '종족값' },
  { key: 'real', label: 'Lv50 실수치' },
] as const

const INITIAL_VIEW_STATE = {
  formKey: '',
  view: 'base' as StatsView,
  baseReplayKey: 0,
  realReplayKey: 0,
}

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
  const pathname = usePathname()
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)

  const { stats } = getActiveFormInfo({
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  })
  const formKey = `${activeType}-${activeIndex}`
  const current =
    viewState.formKey === formKey
      ? viewState
      : { ...INITIAL_VIEW_STATE, formKey }

  const handleChangeView = (nextView: StatsView) => {
    if (nextView === current.view) return

    setViewState({
      ...current,
      view: nextView,
      baseReplayKey: current.baseReplayKey + (nextView === 'base' ? 1 : 0),
      realReplayKey: current.realReplayKey + (nextView === 'real' ? 1 : 0),
    })
    trackEvent('stats_tab_status', {
      tab: nextView,
      form_type: toDetailFormTypeParam(activeType, pathname),
      pokemon_number: pokemonBaseInfo?.number ?? 0,
    })
  }

  if (!stats) return null

  return (
    <section
      aria-labelledby="detail-stats-heading"
      className="w-full px-4 desktop:mx-auto desktop:max-w-7xl"
    >
      <SectionHeading id="detail-stats-heading">능력치</SectionHeading>
      <div className="card-detail mt-4">
        <div className="mb-4">
          <SegmentedControl
            label="능력치 보기 방식"
            items={VIEW_ITEMS}
            value={current.view}
            onChange={handleChangeView}
          />
        </div>
        <div hidden={current.view !== 'base'}>
          <StatBar
            stats={[
              { label: '체력', value: stats.hp },
              { label: '공격', value: stats.attack },
              { label: '특수공격', value: stats.specialAttack },
              { label: '방어', value: stats.defense },
              { label: '특수방어', value: stats.specialDefense },
              { label: '스피드', value: stats.speed },
            ]}
            replayKey={current.baseReplayKey}
          />
        </div>
        <div hidden={current.view !== 'real'}>
          <DetailRealStatTable
            stats={stats}
            replayKey={current.realReplayKey}
          />
        </div>
      </div>
    </section>
  )
}

export default DetailStats
